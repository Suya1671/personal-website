<script lang="ts">
    import {
        createTableOfContents,
        melt,
        type TableOfContentsElements,
        type TableOfContentsItem
    } from '@melt-ui/svelte';

    import ToC from './table-of-contents.svelte';

    let {
        item: itemProp,
        level = 1,
        tree
    }: {
        item?: TableOfContentsElements['item'];
        level?: number;
        tree?: TableOfContentsItem[];
    } = $props();

    // Safety of !: if it doesn't exist, it means we're a level 1 ToC. It'll be handled by the if statement below
    let item = $state(itemProp!);

    if (level == 1) {
        const { elements, states } = createTableOfContents({
            activeType: 'highest-parents',
            exclude: [],
            selector: '#article'
        });

        item = elements.item;
        states.headingsTree.subscribe((value) => (tree = value));
    }
</script>

<ol class:first={level === 1}>
    {#if tree && tree.length}
        {#each tree as heading, i (i)}
            <li
                class:purple={level === 1 || level === 2}
                class:red={level === 3}
                class:orange={level === 4}
                class:teal={level === 5}
                class:blue={level === 6}
            >
                <a href={`#${heading.id}`} use:melt={$item(heading.id)}>
                    {heading.title}
                </a>
            </li>
            {#if heading.children && heading.children.length}
                <li>
                    <ToC {item} level={level + 1} tree={heading.children} />
                </li>
            {/if}
        {/each}
    {/if}
</ol>

<style>
    ol {
        --col: var(--base);

        counter-reset: item;
        padding-left: 1rem;
        font-size: 1rem;
        list-style: none;

        .purple {
            --col: var(--purple);
        }

        .blue {
            --col: var(--blue);
        }

        .orange {
            --col: var(--orange);
        }

        .red {
            --col: var(--red);
        }

        .teal {
            --col: var(--teal);
        }

        a {
            position: relative;
            color: var(--col);
            text-decoration: none;
            transition: all 300ms;

            &::before {
                content: counters(item, '.') '. ';
                counter-increment: item;
                display: inline;
            }

            &::after {
                content: ' ';

                position: absolute;
                bottom: 0;

                display: block;

                width: 0;
                height: 1px;

                background: var(--col) repeat scroll;

                transition: all 300ms;
            }

            &:visited {
                color: var(--col);
            }

            &:hover::after {
                width: 100%;
            }

            &[data-active]::after {
                width: 100%;
            }
        }
    }
</style>
