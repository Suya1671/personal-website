import type { Handle } from '@sveltejs/kit';

import { paraglideMiddleware } from '$lib/paraglide/server';
import { render } from '@master/css-server';

import config from '../master.css';

const paraglideHandle: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ locale, request: localizedRequest }) => {
        event.request = localizedRequest;
        return resolve(event, {
            transformPageChunk: ({ html }) => {
                return render(html.replace('%lang%', locale), config).html;
            }
        });
    });

export const handle: Handle = paraglideHandle;
