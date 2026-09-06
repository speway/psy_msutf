import { spawn } from "node:child_process";
// The supervised preview forwards Vite-style flags; adapt only their spelling.
const incoming = process.argv.slice(2);
const args = incoming.flatMap((arg) =>
  arg === "--strictPort" ? [] : [arg === "--host" ? "--hostname" : arg]
);
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", ...args],
  { stdio: "inherit", env: process.env }
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
