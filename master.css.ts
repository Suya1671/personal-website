import type { Config } from '@master/css';

export default {
    animations: {},
    functions: {},
    modes: {
        dark: 'media',
        light: 'media'
    },
    selectors: {},
    styles: {},
    syntaxes: {
        casl: {
            declare(value) {
                return {
                    'font-variation-settings': `'CASL' ${value}`
                };
            },
            matcher: /^casl:./
        }
    },
    // TODO: update light mode to V3.1
    variables: {
        // surfaces
        base: {
            '@dark': 'lch(2.375062528077578 7.021812868357066 290.3809078762344)',
            '@light': 'lch(88.25172194421276 13.314524320751437 285.52143830851173)'
        },
        // accents
        blue: {
            '@dark': 'lch(70% 45 248)',
            '@light': 'lch(47% 35 252)'
        },
        green: {
            '@dark': 'lch(70% 74 149)',
            '@light': 'lch(47% 56 147)'
        },
        orange: {
            '@dark': 'lch(70% 77 76)',
            '@light': 'lch(47% 57 73)'
        },
        overlay: {
            '@dark': 'lch(6.790939470696763 21.275604238596554 298.09274474634384)',
            '@light': 'lch(81.24022393580408 17.08316717054098 286.247640917274)'
        },
        primary: {
            '@dark': 'lch(41% 42 300)',
            '@light': 'lch(47% 35 252)'
        },
        purple: {
            '@dark': 'lch(70% 52 299)',
            '@light': 'lch(47% 46 300)'
        },
        red: {
            '@dark': 'lch(70% 51 31)',
            '@light': 'lch(47% 73 34)'
        },
        secondary: {
            '@dark': 'lch(70% 45 248)',
            '@light': 'lch(70% 52 299)'
        },
        subtle: {
            '@dark': 'oklch(0.3 0.04 284)',
            '@light': 'oklch(0.3 0.04 284)'
        },
        surface: {
            '@dark': 'lch(3.3849688272607104 17.98565192516903 294.2456818233382)',
            '@light': 'lch(84.72138011691955 17.08707456913321 286.1563677684405)'
        },
        teal: {
            '@dark': 'oklch(0.77 0.2 190)',
            '@light': 'lch(47% 31 190)'
        },
        text: {
            base: {
                '@dark': 'lch(80% 3 290)',
                '@light': 'oklch(20% 0.03 284)'
            },
            overlay: {
                '@dark': 'lch(80% 3 290)',
                '@light': 'oklch(15% 0.07 284)'
            },
            primary: {
                '@dark': 'lch(70% 52 299)',
                '@light': 'lch(47% 35 252)'
            },
            surface: {
                '@dark': 'lch(80% 3 290)',
                '@light': 'oklch(18% 0.05 284)'
            }
        }
    }
} satisfies Config;
