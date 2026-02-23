#!/usr/bin/env node
/**
 * WERA Torque – Update helper (like Dosing workflow)
 * - reads ./version.json
 * - writes APP_VERSION in ./service-worker.js (cache bust for installed PWAs)
 *
 * Usage:
 *   node update.js
 */
const fs = require("fs");

function normalize(v){
  return String(v || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/[^0-9A-Za-z.\-]/g, "")
    .toLowerCase();
}

const versionPath = "./version.json";
const swPath = "./service-worker.js";

if (!fs.existsSync(versionPath)) {
  console.error("Missing version.json");
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(versionPath, "utf8"));
const rawVersion = meta.version || "";
const appVersion = normalize(rawVersion) || "dev";

if (!fs.existsSync(swPath)) {
  console.error("Missing service-worker.js");
  process.exit(1);
}

let sw = fs.readFileSync(swPath, "utf8");
const before = sw;

sw = sw.replace(/const\s+APP_VERSION\s*=\s*['\"][^'\"]*['\"];?/,
                `const APP_VERSION = '${appVersion}';`);

if (sw === before) {
  console.error("Could not update APP_VERSION (pattern not found).");
  process.exit(2);
}

fs.writeFileSync(swPath, sw, "utf8");
console.log(`Updated APP_VERSION -> ${appVersion} (from version.json: ${rawVersion})`);
