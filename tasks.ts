#!/usr/bin/env -S deno run -A

import { deno, main } from "./tasks_utils.ts";

const TASKS = [build, test, dev, start, deploy];
await main(TASKS);

async function start() {
  // write start script

  const PORT = 4507;
  await deno("run", [
    "--allow-read=" + Deno.cwd(),
    "--allow-net=:" + PORT,
    "https://deno.land/std@0.97.0/http/file_server.ts",
    "public",
    "--host=localhost",
    "--port=" + PORT,
  ]);
}

async function build() {
  // write build script
}

async function test() {
  // write test script
}

async function dev() {
  // write dev script
}

async function deploy() {
  // write deploy script
}
