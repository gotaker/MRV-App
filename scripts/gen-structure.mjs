#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const maxDepth = Number(process.env.DEPTH ?? 3);
const ignores = new Set(
  (process.env.IGNORE ?? "node_modules,dist,.angular,coverage,.git")
    .split(",")
    .map((s) => s.trim())
);

function walk(dir, depth = 0) {
  if (depth > maxDepth) return [];
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !ignores.has(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines = [];
  for (const e of entries) {
    const prefix = "│  ".repeat(depth);
    const bullet = depth === 0 ? "" : "├─ ";
    lines.push(`${prefix}${bullet}${e.name}${e.isDirectory() ? "/" : ""}`);
    if (e.isDirectory()) {
      lines.push(...walk(path.join(dir, e.name), depth + 1));
    }
  }
  return lines;
}

const lines = ["```text", path.basename(root) + "/", ...walk(root), "```", ""];
const out = process.argv[2] ?? "STRUCTURE.md";
fs.writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out}`);
