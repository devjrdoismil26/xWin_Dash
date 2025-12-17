// import path from "path";
import { fileURLToPath } from 'url';
import globals from "globals";
import pluginImport from "eslint-plugin-import";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// const __filename = fileURLToPath(import.meta.url);
const reactConfig = {
    ...pluginReactConfig,
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: [
        "dist/**/*",
        "build/**/*",
        "node_modules/**/*",
        "coverage/**/*",
        "*.min.js",
        "*.bundle.js",
        "src/test/utils/test-helpers.ts",
        "src/test/utils/test-helpers.tsx",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/__tests__/**",
        "**/test-utils/**",
        "**/tests/**"
    ],
    languageOptions: {
        ...pluginReactConfig.languageOptions,
        globals: {
            ...globals.browser,
            route: true,
            global: true,
            process: true,
            Buffer: true,
            setImmediate: true,
            WorkerGlobalScope: true,
        },
        parserOptions: {
            ...pluginReactConfig.languageOptions?.parserOptions,
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
    rules: {
        ...pluginReactConfig.rules,
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-no-undef": "warn", // Changed from error to warning
        "react/no-unescaped-entities": "warn", // Changed from error to warning
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-require-imports": "off", // Disabled for .cjs files
        "no-undef": "warn",
        "import/export": "warn",
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};

export default [
  {
    ignores: [
      "dist/**/*",
      "build/**/*", 
      "node_modules/**/*",
      "coverage/**/*",
      "*.min.js",
      "*.bundle.js",
      "scripts/**/*.cjs", // Ignore CommonJS scripts
      "src/test/**/*",
      "src/test-utils/**/*",
      "src/__tests__/**/*",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/tests/**/*"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  reactConfig,
  {
    plugins: {
      import: pluginImport,
      'react-hooks': reactHooks,
    },
    rules: {
      "import/no-unresolved": "off",
      "import/named": "off",
      "import/namespace": "off", 
      "import/default": "off",
      "import/export": "off",
      "import/order": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-unreachable": "off",
    },
    settings: {
      "import/resolver": {
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx"]
        },
        "typescript": {
          "alwaysTryTypes": true,
          "project": "./tsconfig.json"
        }
      }
    }
  },
  // Disable no-undef for TypeScript files (handled by TS checker)
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
    },
  },
  // Special rules for test files
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow any in tests
      "no-undef": "off", // Allow undefined globals in tests
    }
  },
  // Special rules for .cjs files
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    }
  }
];