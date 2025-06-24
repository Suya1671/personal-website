<script lang="ts">
    import PageHead from '$lib/components/page-head.svelte';
</script>

<PageHead description="Licensing information for the chaos portal." title="Licenses" />

<section class="mx:4x text:5x mt:2x">
    <h1>Licenses</h1>

    <p>
        This website, as stated in the footer, is licensed under

        <a
            href="https://creativecommons.org/licenses/by-nc/4.0"
            target="_blank"
            rel="license noopener noreferrer"
            class="creative-commons"
        >
            CC BY-NC 4.0
            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" />
            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" />
            <img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="" />
        </a>. There are however, exceptions to this license:
    </p>

    <ul>
        <li>
            <a href="https://github.com/devicons/devicon">Devicon</a> is licensed under the MIT License.
        </li>
        <li>
            <a href="https://github.com/material-icons/material-icons">Material Icons</a> is licensed
            under the Apache License 2.0.
        </li>
        <li>
            <a href="https://github.com/google/material-design-icons">Material Design Icons</a> is licensed
            under the Apache License 2.0.
        </li>
        <li>
            <a href="https://www.recursive.design/">Recursive</a> is licensed under the SIL Open Font
            License 1.1.
        </li>
    </ul>
</section>

<style>
    section {
        margin: 0 1rem;
        margin-top: 0.5rem;
        font-size: 1.25rem;
    }

    .creative-commons {
        display: inline-flex;
        align-items: center;

        img {
            height: 1.5rem;
            margin-left: 0.5rem;
        }
    }
</style>
