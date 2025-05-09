import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: [
      'zod',
      'vitest.config.ts',
      'next-env.d.ts',
      '.next',
      '.react-email',
      '.vercel',
      '.vscode',
      '**/worker.js',
      'src/generated',
      'node_modules',
      'dist',
      'build',
      'coverage',
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
