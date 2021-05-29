import { existsSync } from "https://deno.land/std@0.93.0/fs/exists.ts";

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

export async function deno(
  subcommand: "run" | "upgrade" | "test" | "bundle",
  params: string[],
) {
  await $(
    [Deno.execPath(), subcommand].concat(params),
  );
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
