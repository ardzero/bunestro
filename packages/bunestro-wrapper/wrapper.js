#!/usr/bin/env node
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cliPath = require.resolve("create-bunestro/dist/cli.js");

await import(cliPath);
