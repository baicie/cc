import { defineConfig } from 'rolldown';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import { builtinModules } from 'module';

const production = process.env.NODE_ENV === 'production';

export default defineConfig({
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
    inlineDynamicImports: false,
    preserveModules: false,
    exports: 'named',
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
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'react' },
        { find: 'react-dom', replacement: 'react-dom' },
      ],
    }),
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      preferBuiltins: true,
      browser: false,
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
    }),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        sourceMap: !production,
      },
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(
          production ? 'production' : 'development',
        ),
      },
    }),
    production && terser({
      compress: {
        drop_console: false,
        pure_funcs: ['console.debug'],
      },
      mangle: {
        safari10: true,
      },
    }),
  ].filter(Boolean),
  treeshake: {
    moduleSideEffects: (id) => {
      if (id.includes('node_modules')) return true;
      if (id.includes('@anthropic-ai')) return true;
      if (id.includes('@modelcontextprotocol')) return true;
      return false;
    },
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning);
  },
});
