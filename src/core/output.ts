export interface OutputOptions {
  pretty?: boolean;
  quiet?: boolean;
}

export function printOutput(data: unknown, opts: OutputOptions = {}): void {
  if (opts.quiet) return;
  const output = opts.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  console.log(output);
}

export function printError(err: { error: string; code: string }): void {
  console.error(JSON.stringify(err));
}
