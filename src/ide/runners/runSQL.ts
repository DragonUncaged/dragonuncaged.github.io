import type { RunIO } from "./index";
import { buildSeedSQL, SQL_SCHEMA } from "../sqlSchema";

const SQLJS_VERSION = "1.10.3";
const SQLJS_BASE = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;
const TIMEOUT_MS = 8000;
const MAX_CELL = 40;

/* -------------------------------- the worker ------------------------------- */

const WORKER_SRC = `
  let db = null;
  self.onmessage = async (e) => {
    const msg = e.data;

    if (msg.type === "init") {
      try {
        importScripts(msg.base + "sql-wasm.js");
        const SQL = await initSqlJs({ locateFile: (f) => msg.base + f });
        db = new SQL.Database();
        db.run(msg.seed);
        const v = db.exec("select sqlite_version()")[0].values[0][0];
        postMessage({ type: "ready", version: v });
      } catch (err) {
        postMessage({ type: "fatal", text: String((err && err.message) || err) });
      }
      return;
    }

    if (msg.type === "query") {
      try {
        // getRowsModified() wraps sqlite3_changes(), which reports the last
        // DML statement and goes stale after DDL — diffing total_changes()
        // counts what this batch actually touched
        const changes = () => db.exec("SELECT total_changes()")[0].values[0][0];
        const before = changes();
        // sql.js is synchronous — this blocks the worker, never the UI, and
        // terminate() from the host is the only way to interrupt it
        const results = db.exec(msg.sql);
        postMessage({
          type: "result",
          results: results.map((r) => ({ columns: r.columns, values: r.values })),
          modified: changes() - before,
        });
      } catch (err) {
        postMessage({ type: "error", text: String((err && err.message) || err) });
      }
    }
  };
`;

interface ResultSet {
  columns: string[];
  values: (string | number | null)[][];
}

let workerPromise: Promise<Worker> | null = null;
let workerRef: Worker | null = null;
let workerURL: string | null = null;
/** the wasm is HTTP-cached after the first boot, so only say "downloading" once */
let bootedOnce = false;

/** next run boots a freshly seeded database */
function killWorker() {
  if (workerRef) workerRef.terminate();
  if (workerURL) URL.revokeObjectURL(workerURL);
  workerRef = null;
  workerURL = null;
  workerPromise = null;
}

function getWorker(io: RunIO): Promise<Worker> {
  if (!workerPromise) {
    io.system(
      bootedOnce
        ? "Restarting SQLite…"
        : "Downloading SQLite (sql.js/WebAssembly, ~1 MB, one time)…"
    );
    bootedOnce = true;
    workerPromise = new Promise<Worker>((resolve, reject) => {
      const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      workerURL = URL.createObjectURL(blob);
      const worker = new Worker(workerURL);
      workerRef = worker;

      worker.onmessage = (e) => {
        if (e.data.type === "ready") {
          io.system(
            `SQLite ${e.data.version} ready — ${SQL_SCHEMA.length} tables loaded from this portfolio. Type .schema in the terminal to see their columns.`
          );
          resolve(worker);
        } else if (e.data.type === "fatal") {
          reject(new Error(e.data.text));
        }
      };
      worker.onerror = (e) => reject(new Error(e.message || "worker failed"));
      worker.postMessage({ type: "init", base: SQLJS_BASE, seed: buildSeedSQL() });
    });

    workerPromise.catch(() => killWorker()); // allow retry after a network failure
  }
  return workerPromise;
}

/* ------------------------------ dot-commands ------------------------------- */

/**
 * The handful of sqlite3 CLI dot-commands worth having. They read
 * `sqlite_master` rather than our static schema, so tables the visitor CREATEs
 * during the session show up too.
 */
interface DotCommand {
  sql: string;
  /** "raw" prints each cell on its own line; "list" wraps names into columns */
  mode: "raw" | "list";
  missing: string;
}

const USER_TABLES =
  "type = 'table' AND name NOT LIKE 'sqlite_%'";

function parseDotCommand(code: string): DotCommand | "help" | null {
  // find the first line that is actually a statement — a .sql file normally
  // opens with a -- comment header, and the command sits underneath it
  const line = code
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("--"));
  if (!line) return null;

  // docs render these as `.schema`, and people paste the backticks along with
  // it — strip them rather than fail with a baffling syntax error
  const cleaned = line.replace(/[`;]/g, "").trim();
  if (!cleaned.startsWith(".")) return null;

  const [cmd, ...rest] = cleaned.split(/\s+/);
  const arg = rest.join(" ").trim();

  if (cmd === ".help") return "help";

  if (cmd === ".tables") {
    return {
      sql: `SELECT name FROM sqlite_master WHERE ${USER_TABLES} ORDER BY name;`,
      mode: "list",
      missing: "no tables",
    };
  }

  if (cmd === ".schema") {
    return {
      sql: arg
        ? `SELECT sql FROM sqlite_master WHERE ${USER_TABLES} AND name = '${arg.replace(
            /'/g,
            "''"
          )}';`
        : `SELECT sql FROM sqlite_master WHERE ${USER_TABLES} ORDER BY name;`,
      mode: "raw",
      missing: arg ? `no such table: ${arg}` : "no tables",
    };
  }

  return null;
}

const HELP_LINES = [
  ".tables            list every table in the session",
  ".schema            show CREATE statements for all tables",
  ".schema <table>    show one table's CREATE statement",
  ".help              this list",
  "",
  "Everything else is executed as SQL. Tables you CREATE persist between runs.",
];

/* ------------------------------- formatting -------------------------------- */

const cell = (v: string | number | null) => {
  const s = v === null ? "NULL" : String(v);
  return s.length > MAX_CELL ? s.slice(0, MAX_CELL - 1) + "…" : s;
};

/** renders a result set as an sqlite3-style ASCII table */
function formatTable({ columns, values }: ResultSet): string[] {
  const body = values.map((row) => row.map(cell));
  const widths = columns.map((c, i) =>
    Math.max(c.length, ...body.map((row) => row[i].length), 0)
  );
  const row = (cells: string[]) =>
    cells.map((c, i) => ` ${c.padEnd(widths[i])} `).join("|");

  return [
    row(columns),
    widths.map((w) => "-".repeat(w + 2)).join("+"),
    ...body.map(row),
  ];
}

/* ---------------------------------- runner --------------------------------- */

/**
 * Runs SQL against an in-browser SQLite database, seeded from the portfolio.
 * The worker is long-lived, so tables you CREATE stay around between runs.
 */
export async function runSQL(code: string, io: RunIO): Promise<number> {
  const dot = parseDotCommand(code);
  if (dot === "help") {
    HELP_LINES.forEach((l) => io.stdout(l));
    return 0;
  }

  let worker: Worker;
  try {
    worker = await getWorker(io);
  } catch {
    io.stderr(
      "Could not download SQLite. Check your network connection and try again."
    );
    return 1;
  }

  return new Promise<number>((resolve) => {
    let finished = false;
    const finish = (exitCode: number) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve(exitCode);
    };

    const timer = setTimeout(() => {
      io.stderr(`process killed: exceeded ${TIMEOUT_MS / 1000}s time limit`);
      io.system("the database session was reset.");
      killWorker();
      finish(137);
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      const msg = e.data;

      if (msg.type === "error") {
        io.stderr(msg.text);
        // the classic confusion: a dot-command mixed in with real SQL
        if (/\.(schema|tables|help)\b/.test(code)) {
          io.system(
            "dot-commands like .schema only work on their own — put one in a file with no other SQL, or type it straight into the terminal."
          );
        }
        finish(1);
        return;
      }

      const results: ResultSet[] = msg.results;

      if (dot) {
        const values = results[0]?.values ?? [];
        if (values.length === 0) {
          io.system(dot.missing);
        } else if (dot.mode === "raw") {
          // CREATE statements, printed as-is with a blank line between them
          values.forEach((r, i) => {
            if (i > 0) io.stdout("");
            String(r[0]).split("\n").forEach((l) => io.stdout(l));
          });
        } else {
          io.stdout(values.map((r) => String(r[0])).join("  "));
        }
        finish(0);
        return;
      }

      if (results.length === 0) {
        // CREATE / INSERT / UPDATE / DELETE return no rows
        io.stdout(
          msg.modified === 0
            ? "ok"
            : `${msg.modified} row${msg.modified === 1 ? "" : "s"} affected`
        );
      } else {
        results.forEach((set, i) => {
          if (i > 0) io.stdout("");
          formatTable(set).forEach((line) => io.stdout(line));
          const n = set.values.length;
          io.system(`${n} row${n === 1 ? "" : "s"} in set`);
        });
      }
      finish(0);
    };

    worker.onerror = (e) => {
      io.stderr(e.message || "SQLite worker crashed");
      killWorker();
      finish(1);
    };

    worker.postMessage({ type: "query", sql: dot ? dot.sql : code });
  });
}
