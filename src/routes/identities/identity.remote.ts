import * as v from 'valibot'
import { query } from '$app/server'

export const getPGPKey = query(
    v.string(),
    async (keyCode) =>
        await fetch(`https://keys.openpgp.org/vks/v1/by-keyid/${keyCode}`).then((response) =>
            response.text()
        )
)
