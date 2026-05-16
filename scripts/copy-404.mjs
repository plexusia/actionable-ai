import { copyFileSync, existsSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("dist-pages");
let index = resolve(outDir, "index.html");

if (!existsSync(index)) {
  const alt = resolve(outDir, "index.github.html");
  if (existsSync(alt)) {
    renameSync(alt, index);
    console.log("copy-404: renamed index.github.html → index.html");
  }
}

if (!existsSync(index)) {
  console.error("copy-404: no index.html in dist-pages. Run build:pages first.");
  process.exit(1);
}

copyFileSync(index, resolve(outDir, "404.html"));
console.log("copy-404: wrote dist-pages/404.html for GitHub Pages SPA routing");
