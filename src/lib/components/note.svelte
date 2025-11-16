<script lang="ts">
import type { Snippet } from 'svelte'

const { children }: { children: Snippet } = $props()
</script>

<aside class="grid-area:note mr:4rem">
    <hr class="fg:primary" />
    {@render children()}
    <hr class="fg:primary" />
</aside>
