<script lang="ts">
    import { localizeHref } from '$lib/paraglide/runtime';

    const { footerText }: { footerText: string } = $props();
</script>

<footer
    class="flex bg:surface px:6x rt:2x text:5x align-items:center fg:surface justify-content:space-between mt:6x text:center text:6x@sm mx:6x@lg px:4x@lg flex:col@<sm"
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
