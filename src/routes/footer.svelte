<script lang="ts">
    import { localizeHref } from '$lib/paraglide/runtime';

    const { footerText }: { footerText: string } = $props();
</script>

<footer
    class="flex align-items:center bg:surface fg:surface flex:col@<sm justify-content:space-between mt:6x mx:6x@lg px:6x px:4x@lg rt:2x text:5x text:6x@sm text:center"
>
    <p class="font:semibold">
        Suya1671 | ©️ Suya 2024 under
        <a
            href="https://creativecommons.org/licenses/by-nc/4.0"
            target="_blank"
            rel="license noopener noreferrer"
            class="inline-flex align-items:center"
        >
            CC BY-NC 4.0
        </a>
        <br class="display:none@>sm" />
        <a href={localizeHref('/licenses')}>unless stated otherwise</a>
    </p>
    <p>{footerText}</p>
</footer>
