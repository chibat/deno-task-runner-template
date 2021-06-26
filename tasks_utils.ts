import { existsSync } from "https://deno.land/std@0.99.0/fs/exists.ts";

export async function main(tasks: (() => Promise<void>)[]) {
  const taskName = Deno.args[0];
  if (!taskName) {
    tasks.forEach((task) => console.log(task.name));
    Deno.exit(0);
  }
  const task = tasks.find((task) => task.name === taskName);
  if (task) {
    await task();
  } else {
    console.log("Unknown task name");
    Deno.exit(1);
  }
}

export async function $(cmd: string[]) {
  const status = await Deno.run({
    cmd,
    stdout: "inherit",
    stderr: "inherit",
  }).status();
  if (status.code != 0) {
    Deno.exit(status.code);
  }
}

export function rm(path: string) {
  if (existsSync(path)) {
    Deno.removeSync(path, { recursive: true });
  }
}

export async function denoDir() {
  const p = Deno.run({
    cmd: [Deno.execPath(), "info", "--json", "--unstable"],
    stdout: "piped",
    stderr: "null",
  });
  const output = (new TextDecoder()).decode(await p.output());
  p.close();
  return JSON.parse(output).denoDir;
}

class DenoCommand {
  cmd = [Deno.execPath()];
  run() {
    this.cmd = this.cmd.concat("run");
    return this;
  }
  param(name: string, ...values: string[]) {
    this.cmd = this.cmd.concat(name + "=" + values.join(","));
    return this;
  }

  allowRead(...values: string[]) {
    return this.param("--allow-read", ...values);
  }

  allowWrite(...values: string[]) {
    return this.param("--allow-write", ...values);
  }

  allowEnv(...values: string[]) {
    return this.param("--allow-env", ...values);
  }

  allowNet(...values: string[]) {
    return this.param("--allow-net", ...values);
  }

  allowRun(...values: string[]) {
    return this.param("--allow-run", ...values);
  }

  args(...values: string[]) {
    this.cmd = this.cmd.concat(values);
    return this;
  }

  async execute() {
    await $(this.cmd);
  }

  noCheck() {
    this.cmd = this.cmd.concat("--no-check");
    return this;
  }
}

export function deno() {
  return new DenoCommand();
}
