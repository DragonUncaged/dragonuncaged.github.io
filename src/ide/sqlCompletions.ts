import { SQL_SCHEMA } from "./sqlSchema";

// Schema-aware autocomplete for the SQL editor.

/** words that can follow a table name but are never an alias */
const NOT_AN_ALIAS = new Set([
  "where", "join", "inner", "left", "right", "full", "outer", "cross",
  "on", "using", "group", "order", "having", "limit", "offset", "union",
  "as", "set", "values", "select", "natural", "window",
]);

/** table -> alias bindings currently in scope, e.g. `FROM projects p` */
function aliasMap(text: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /\b(?:from|join)\s+([a-z_]\w*)(?:\s+(?:as\s+)?([a-z_]\w*))?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const [, table, maybeAlias] = m;
    map.set(table, table);
    if (maybeAlias && !NOT_AN_ALIAS.has(maybeAlias.toLowerCase())) {
      map.set(maybeAlias, table);
    }
  }
  return map;
}

let registered = false;

export function registerSQLCompletions(monaco: any) {
  if (registered) return; // the provider is global
  registered = true;

  monaco.languages.registerCompletionItemProvider("sql", {
    triggerCharacters: [" ", ".", ","],

    provideCompletionItems(model: any, position: any) {
      const upto = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      // aliases bind from the whole document, not just the text behind the
      // cursor — in `SELECT p.| FROM projects p` the FROM clause comes later
      const aliases = aliasMap(model.getValue());

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const tableItem = (t: (typeof SQL_SCHEMA)[number]) => ({
        label: t.name,
        kind: monaco.languages.CompletionItemKind.Struct,
        detail: `table · ${t.columns.length} columns`,
        documentation: `${t.description}\n\n${t.columns
          .map((c) => `${c.name} — ${c.type}`)
          .join("\n")}`,
        insertText: t.name,
        range,
      });

      const columnItem = (
        col: { name: string; type: string },
        table: string,
        qualified = false
      ) => ({
        label: col.name,
        kind: monaco.languages.CompletionItemKind.Field,
        detail: `${col.type} · ${table}`,
        insertText: col.name,
        // columns of the table you actually named should outrank the rest
        sortText: qualified ? `0_${col.name}` : `1_${col.name}`,
        range,
      });

      // `alias.` — only that table's columns make sense here
      const dotted = /([a-z_]\w*)\.\w*$/i.exec(upto);
      if (dotted) {
        const target = aliases.get(dotted[1]) ?? dotted[1];
        const table = SQL_SCHEMA.find((t) => t.name === target);
        if (!table) return { suggestions: [] };
        return {
          suggestions: table.columns.map((c) => columnItem(c, table.name, true)),
        };
      }

      // right after FROM / JOIN / INTO / UPDATE, only tables make sense
      if (/\b(from|join|into|update)\s+\w*$/i.test(upto)) {
        return { suggestions: SQL_SCHEMA.map(tableItem) };
      }

      // anywhere else: columns of the tables in scope first, then everything
      const inScope = new Set(aliases.values());
      const suggestions = [
        ...SQL_SCHEMA.flatMap((t) =>
          t.columns.map((c) => columnItem(c, t.name, inScope.has(t.name)))
        ),
        ...SQL_SCHEMA.map(tableItem),
      ];
      return { suggestions };
    },
  });
}
