<script lang="ts">
import { localizeHref } from '$lib/paraglide/runtime'

const { footerText }: { footerText: string } = $props()
</script>

<footer>
    <p class="copyright">
        Suya1671 | ©️ Suya 2024 under
        <a
            href="https://creativecommons.org/licenses/by-nc/4.0"
            target="_blank"
            rel="license noopener noreferrer"
        >
            CC BY-NC 4.0
        </a>
        <br />
        <a href={localizeHref('/licenses')}>unless stated otherwise</a>
    </p>
    <p>{footerText}</p>
</footer>

<style>
    footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-top: 1.5rem;
        padding: 1.5rem;

        font-size: 1.25rem;
        color: var(--base);
        text-align: center;

        background: var(--surface);

        .copyright {
            font-weight: 600;

            a {
                display: inline-flex;
                align-items: center;
            }
        }

        br {
            @media (width > 52.125rem) {
                display: none;
            }
        }

        @media (width < 52.125rem) {
            flex-direction: column;
        }

        @media (width > 52.125rem) {
            font-size: 1.5rem;
        }

        @media (width > 80rem) {
            margin: 0 1.5rem;
            padding: 0.5rem 1rem;
            border-radius: 1.5rem 1.5rem 0 0;
        }
    }
</style>
