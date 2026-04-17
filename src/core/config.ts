import { homedir } from 'os';
import { join } from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export interface FirefliesConfig {
  apiKey?: string;
}

const CONFIG_DIR = join(homedir(), '.fireflies-cli');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export async function readConfig(): Promise<FirefliesConfig> {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    const raw = await readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(raw) as FirefliesConfig;
  } catch {
    return {};
  }
}

export async function writeConfig(config: FirefliesConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

export async function clearConfig(): Promise<void> {
  await writeConfig({});
}
