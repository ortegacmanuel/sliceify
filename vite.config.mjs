import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    // Use classic JSX transform with Preact factory from @bpmn-io exports
    jsx: 'transform',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
});


