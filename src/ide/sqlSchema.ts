import { profile, projects, skills, resume } from "../data/portfolio";

export interface ColumnDef {
  name: string;
  type: string;
}

export interface TableDef {
  name: string;
  description: string;
  columns: ColumnDef[];
  rows: () => (string | number | null)[][];
}

export const SQL_SCHEMA: TableDef[] = [
  {
    name: "projects",
    description: "Shipped projects, one row each",
    columns: [
      { name: "id", type: "INTEGER PRIMARY KEY" },
      { name: "name", type: "TEXT NOT NULL" },
      { name: "description", type: "TEXT" },
      { name: "language", type: "TEXT" },
      { name: "url", type: "TEXT" },
    ],
    rows: () =>
      projects.map((p, i) => [i + 1, p.name, p.description, p.language, p.live]),
  },
  {
    name: "project_tech",
    description: "Tech used per project — join this to projects.id",
    columns: [
      { name: "project_id", type: "INTEGER REFERENCES projects(id)" },
      { name: "tech", type: "TEXT NOT NULL" },
    ],
    rows: () => projects.flatMap((p, i) => p.tech.map((t) => [i + 1, t])),
  },
  {
    name: "skills",
    description: "Everything in the Extensions sidebar",
    columns: [
      { name: "id", type: "INTEGER PRIMARY KEY" },
      { name: "name", type: "TEXT NOT NULL" },
    ],
    rows: () => skills.map((s, i) => [i + 1, s.name]),
  },
  {
    name: "experience",
    description: "Work history, most recent first",
    columns: [
      { name: "id", type: "INTEGER PRIMARY KEY" },
      { name: "company", type: "TEXT NOT NULL" },
      { name: "role", type: "TEXT" },
      { name: "period", type: "TEXT" },
      { name: "location", type: "TEXT" },
    ],
    rows: () =>
      resume.experience.map((e, i) => [
        i + 1,
        e.company,
        e.role,
        e.period,
        e.location,
      ]),
  },
  {
    name: "education",
    description: "Degrees",
    columns: [
      { name: "id", type: "INTEGER PRIMARY KEY" },
      { name: "institution", type: "TEXT NOT NULL" },
      { name: "degree", type: "TEXT" },
      { name: "period", type: "TEXT" },
      { name: "location", type: "TEXT" },
    ],
    rows: () =>
      resume.education.map((e, i) => [
        i + 1,
        e.institution,
        e.degree,
        e.period,
        e.location,
      ]),
  },
  {
    name: "profile",
    description: "Key/value facts about Ankit",
    columns: [
      { name: "key", type: "TEXT PRIMARY KEY" },
      { name: "value", type: "TEXT" },
    ],
    rows: () => [
      ["name", profile.name],
      ["handle", profile.handle],
      ["role", profile.role],
      ["location", profile.location],
      ["email", profile.email],
      ["github", profile.github],
    ],
  },
];

const quote = (v: string | number | null) =>
  v === null
    ? "NULL"
    : typeof v === "number"
    ? String(v)
    : `'${v.replace(/'/g, "''")}'`;

/** the CREATE TABLE text, column types aligned — this is what `.schema` shows */
export function createStatement(table: TableDef): string {
  const width = Math.max(...table.columns.map((c) => c.name.length));
  const cols = table.columns
    .map((c) => `  ${c.name.padEnd(width)} ${c.type}`)
    .join(",\n");
  return `CREATE TABLE ${table.name} (\n${cols}\n);`;
}

/** full seed script: schema + data, generated from `data/portfolio.ts` */
export function buildSeedSQL(): string {
  return SQL_SCHEMA.map((t) =>
    [
      createStatement(t),
      ...t
        .rows()
        .map((r) => `INSERT INTO ${t.name} VALUES (${r.map(quote).join(", ")});`),
    ].join("\n")
  ).join("\n");
}

/** one-line summary used in the seeded .sql file's header comment */
export function schemaOutline(): string[] {
  return SQL_SCHEMA.map(
    (t) => `--   ${t.name}(${t.columns.map((c) => c.name).join(", ")})`
  );
}
