import { existsSync } from "https://deno.land/std@0.99.0/fs/exists.ts";

export async function tasks(...taskArgs: (() => Promise<void>)[]) {
  const taskName = Deno.args[0];
  if (!taskName) {
    taskArgs.forEach((task) => console.log(task.name));
    Deno.exit(0);
  }
  const task = taskArgs.find((task) => task.name === taskName);
  if (task) {
    await task();
  } else {
    console.log("Unknown task name");
    Deno.exit(1);
  }
}

export async function $(cmd: string[]): Promise<void> {
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

type DenoOptions = {
  command: "run" | "cache";
  "--allow-read"?: string[];
  "--allow-net"?: string[];
  args: string[];
};

export async function deno(options: DenoOptions): Promise<void> {
  const cmd = [Deno.execPath()];
  cmd.push(options.command);
  if (options["--allow-read"]) {
    cmd.push("--allow-read" + "=" + options["--allow-read"].join(","));
  }
  if (options["--allow-net"]) {
    cmd.push("--allow-net" + "=" + options["--allow-net"].join(","));
  }
  cmd.push(...options.args);
  await $(cmd);
}
