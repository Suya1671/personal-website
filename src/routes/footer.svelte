<script lang="ts">
    const { footerText }: { footerText: string } = $props();
</script>

<footer
    class="flex align-items:center bg:surface fg:surface flex:col@<sm justify-content:space-between mt:6x mx:6x@lg px:6x px:4x@lg rt:2x"
>
    <p class="font:semibold text:6x">
        Suya1671 |
        <a href="https://github.com/Suyashtnt/personal-website/blob/master/LICENSE">
            ©️ Suyash 2024
        </a>
    </p>
    <p>{footerText}</p>
</footer>
