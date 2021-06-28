#!/usr/bin/env -S deno run -A

import { deno, tasks } from "./tasks_utils.ts";

await tasks(build, test, dev, start, deploy);

async function start() {
  // write start script

  const PORT = 4507;
  await deno({
    command: "run",
    "--allow-read": [Deno.cwd()],
    "--allow-net": [":" + PORT],
    args: [
      "https://deno.land/std@0.99.0/http/file_server.ts",
      "public",
      "--host=localhost",
      "--port=" + PORT,
    ],
  });
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
