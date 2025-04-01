import * as m from '$lib/paraglide/messages';
import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ depends }) => {
    depends('paraglide:lang');

    const potentialFooterTexts = [
        m.footer_txt_1(),
        m.footer_txt_2(),
        m.footer_txt_3(),
        m.footer_txt_4()
    ] as const;

    const footerText =
        potentialFooterTexts[Math.floor(Math.random() * potentialFooterTexts.length)] ??
        error(500, 'No footer text found. This should never happen');

    return {
        footerText
    };
}) satisfies LayoutServerLoad;
