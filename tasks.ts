#!/usr/bin/env -S deno run -A

import { deno } from "./tasks_utils.ts";

const TASKS = [matchDenoVersion, build, test, dev, start, deploy];

async function matchDenoVersion() {
  await deno("upgrade", ["--version=1.10.2"]);
}

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

const taskName = Deno.args[0];
if (!taskName) {
  TASKS.forEach((task) => console.log(task.name));
  Deno.exit(0);
}
const task = TASKS.find((task) => task.name === taskName);
if (task) {
  await task();
} else {
  console.log("Unknown task name");
  Deno.exit(1);
}
