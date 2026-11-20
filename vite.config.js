import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'emit-social-preview',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'social-preview.png',
          source: readFileSync(resolve(projectRoot, 'social-preview.png')),
        });
      },
    },
  ],
});
