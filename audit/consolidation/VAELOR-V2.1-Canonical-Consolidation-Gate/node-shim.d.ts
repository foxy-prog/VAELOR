declare module "node:fs/promises" {
  export function mkdir(path: string, options?: unknown): Promise<void>;
  export function mkdtemp(prefix: string): Promise<string>;
  export function rm(path: string, options?: unknown): Promise<void>;
  export function readFile(path: string, encoding: string): Promise<string>;
  export function writeFile(path: string, data: string, encoding: string): Promise<void>;
  export function appendFile(path: string, data: string, encoding: string): Promise<void>;
  export function rename(oldPath: string, newPath: string): Promise<void>;
}
declare module "node:path" { export function join(...parts: string[]): string; }
declare module "node:os" { export function tmpdir(): string; }
declare module "node:crypto" { export function randomUUID(): string; const crypto: { randomUUID(): string }; export default crypto; }
declare const process: { env: Record<string,string|undefined>; exitCode?: number; exit(code?: number): never; };
