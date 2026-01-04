#!/usr/bin/env node
import { createRequire } from "module";
import { pathToFileURL } from "url";

const require = createRequire(import.meta.url);
const cliPath = require.resolve("create-bunestro/dist/cli.js");

await import(pathToFileURL(cliPath).href);
