import { defineConfig } from 'rolldown';
import { builtinModules } from 'module';
import terser from '@rollup/plugin-terser';

const production = process.env.NODE_ENV === 'production';

export default defineConfig({
  resolve: {
    alias: {
      'bun:bundle': '/Users/liuzhiwei/Desktop/workspace/git-code/cc/src/utils/bun-bundle-polyfill.ts',
    },
  },
  input: {
    main: './src/main.tsx',
    cli: './src/entrypoints/cli.tsx',
    mcp: './src/entrypoints/mcp.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: !production,
    chunkFileNames: '[name]-[hash].js',
    entryFileNames: '[name].js',
    codeSplitting: true,
    preserveModules: false,
    exports: 'named',
    minify: false,
  },
  external: [
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`),
    'bun:bundle',
    'bun:ffi',
    'bun:sqlite',
    'bun:spawn',
    'bun:jsc',
    'bun:windows',
    'react-dom/server',
    'node:fs',
    'node:fs/promises',
    'node:path',
    'node:child_process',
    'node:crypto',
    'node:http',
    'node:https',
    'node:url',
    'node:util',
    'node:stream',
    'node:os',
    'node:tty',
    'node:net',
    'node:dgram',
    'node:events',
    'node:readline',
    'node:querystring',
    'node:string_decoder',
    'node:buffer',
    'node:constants',
    'node:v8',
    'node:worker_threads',
    'node:assert',
    'node:perf_hooks',
    'node:process',
    'node:domain',
    'node:timers',
    'node:zlib',
    'node:module',
    'node:sys',
    'node:inspector',
    'node:repl',
    /node_modules/,
    /\.node$/,
  ],
  treeshake: {
    moduleSideEffects: (id) => {
      if (id.includes('node_modules')) return true;
      if (id.includes('@anthropic-ai')) return true;
      if (id.includes('@modelcontextprotocol')) return true;
      return false;
    },
    propertyReadSideEffects: false,
  },
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning);
  },
});
