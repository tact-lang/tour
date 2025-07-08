/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    reporters: [['default', { summary: false }]],
    include: [
      'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      'src/**/*.{spec,test}.{js,jsx,ts,tsx}'
    ],
    coverage: {
      include: [
        'src/**/*.{js,jsx,ts,tsx}'
      ],
      exclude: [
        'src/**/*.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      "^react-native$": "react-native-web",
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    }
  },
  define: {
    'process.env.PUBLIC_URL': '""',
  }
});
