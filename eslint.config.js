import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierPluginReccomended from 'eslint-plugin-prettier/recommended';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

/** @type {import("eslint").Linter.RulesRecord} */
const defaultRules = {
    ...typescriptPlugin.configs.recommended?.rules,
    'arrow-body-style': 'off',
    'no-undef': 'off',
    'prefer-arrow-callback': 'off'
};

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
    {
        ignores: ['.svelte-kit/**/*', 'node_modules/**/*', 'src/lib/paraglide/**/*']
    },
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                extraFileExtensions: ['.svelte'],
                project: './tsconfig.json',
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            prettier: prettierPlugin
        },
        rules: {
            ...defaultRules,
            'prettier/prettier': ['error']
        }
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: typescriptParser
            }
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            prettier: prettierPlugin,
            svelte: sveltePlugin
        },
        processor: 'svelte/svelte',
        rules: {
            ...defaultRules,
            ...sveltePlugin.configs.recommended.rules
            // ...sveltePlugin.configs.prettier.rules,
        }
    },
    perfectionist.configs['recommended-natural'],
    prettierPluginReccomended
];
