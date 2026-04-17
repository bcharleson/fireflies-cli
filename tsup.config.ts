import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    mcp: 'src/mcp.ts',
  },
  format: ['esm'],
  target: 'node18',
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  splitting: false,
  sourcemap: false,
  dts: false,
});
