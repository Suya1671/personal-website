import type { Handle } from '@sveltejs/kit';

import { paraglideMiddleware } from '$lib/paraglide/server';

const paraglideHandle: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ locale, request: localizedRequest }) => {
        event.request = localizedRequest;
        return resolve(event, {
            transformPageChunk: ({ html }) => {
                return html.replace('%lang%', locale);
            }
        });
    });

export const handle: Handle = paraglideHandle;
