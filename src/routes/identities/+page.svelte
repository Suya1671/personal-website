<script lang="ts">
import {
    createMessage,
    encrypt,
    enums,
    type Key,
    type Message,
    readCleartextMessage,
    readKeys,
    readMessage,
    readSignature,
    type Signature,
    type VerifyMessageResult,
    verify
} from 'openpgp'
import { browser } from '$app/environment'
import PageHead from '$lib/components/page-head.svelte'
import { getPGPKey } from './identity.remote'

const keyCode = '0x55CC53F6D4679D55'
const pgpKeys = $derived(await getPGPKey(keyCode).then((data) => readKeys({ armoredKeys: data })))

const keyFlagToString = (flag: number) => {
    switch (flag) {
        case enums.keyFlags.authentication:
            return 'Authentication'
        case enums.keyFlags.certifyKeys:
            return 'Certification'
        case enums.keyFlags.encryptCommunication:
        case enums.keyFlags.encryptStorage:
        case 12:
            return 'Encryption'
        case enums.keyFlags.signData:
            return 'Signing'
        default:
            return 'Unknown'
    }
}

const keyFlagsToString = (flags?: Uint8Array | null) => {
    if (!flags?.length) {
        return 'Unknown'
    }

    return Array.from(flags, (flag) => keyFlagToString(flag)).join(', ')
}

const getKeyCapabilities = async (key: Key) => {
    const capabilities = {
        sign: false,
        encrypt: false,
        auth: false
    }

    const checkFlags = (flags: Uint8Array | null | undefined) => {
        if (!flags) return
        if (flags.includes(enums.keyFlags.signData)) capabilities.sign = true
        if (
            flags.includes(enums.keyFlags.encryptCommunication) ||
            flags.includes(enums.keyFlags.encryptStorage) ||
            flags.includes(12)
        )
            capabilities.encrypt = true
        if (flags.includes(enums.keyFlags.authentication)) capabilities.auth = true
    }

    // Check mainkey
    try {
        const primaryUser = await key.getPrimaryUser()
        checkFlags(primaryUser.selfCertification.keyFlags)
    } catch (e) {
        console.error('Error getting primary user', e)
    }

    // Check subkeys
    const subkeys = key.getSubkeys()
    for (const subkey of subkeys) {
        const mainBindingSignature = subkey.bindingSignatures.find(
            (bindingSignature) => bindingSignature.issuerKeyID.bytes === key.getKeyID().bytes
        )
        checkFlags(mainBindingSignature?.keyFlags)
    }

    return capabilities
}

async function handleValidateSubmit(e: Event) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const messageText = formData.get('message') as string | null
    const messageFile = formData.get('messageFile') as File | null
    const signatureFile = formData.get('signatureFile') as File | null
    const mainKeyId = formData.get('mainKeyId') as string

    const key = pgpKeys.find((k) => k.getKeyID().toHex().toUpperCase() === mainKeyId)
    if (!key) {
        alert('Key not found')
        return
    }

    const messageFileExists = messageFile !== null && messageFile.size > 0
    const signatureFileExists = signatureFile !== null && signatureFile.size > 0

    if (messageFileExists && messageText) {
        alert('Please provide only one message source')
        return
    }

    const checkValidation = async (result: VerifyMessageResult) => {
        const signatures = await Promise.all(
            result.signatures.map(async (signature) => {
                try {
                    // for some cursed reason, signature.verified throws on an invalid signature, rather than returning false.
                    const verified = await signature.verified
                    return { ...signature, verified }
                } catch (err) {
                    return { ...signature, verified: false as const, error: err }
                }
            })
        )

        return signatures.find((signature) => signature.verified)
    }

    // TODO
    // - Ability to download the data extracted
    // - Use an actual html dialog rather than an alert
    if (signatureFileExists) {
        // Detached signature
        const sigText = await signatureFile.text()
        const hasSignature = sigText.includes('BEGIN PGP SIGNATURE')

        const readFileSignature = async () => {
            const sigArray = new Uint8Array(await signatureFile.arrayBuffer())
            return await readSignature({ binarySignature: sigArray })
        }

        const signature: Signature = hasSignature
            ? await readSignature({ armoredSignature: sigText })
            : await readFileSignature()

        const message = messageFileExists
            ? await createMessage({ binary: new Uint8Array(await messageFile.arrayBuffer()) })
            : await createMessage({ text: messageText })

        const verificationResult = await verify({
            message,
            signature,
            verificationKeys: key
        })

        const validSignature = await checkValidation(verificationResult)

        if (validSignature) {
            alert(`Signature verified! ID: ${validSignature.keyID.toHex().toUpperCase()}.`)
        } else {
            alert('Signature invalid')
        }
    } else if (messageFileExists) {
        // Message, attached signature
        try {
            const message = await readMessage({ armoredMessage: await messageFile.text() })
            const result = await verify({ message, verificationKeys: key })
            const signature = await checkValidation(result)
            console.log(signature)

            if (signature) {
                alert(`Signature verified! ID: ${signature.keyID.toHex().toUpperCase()}.`)
            } else {
                alert('Signature invalid')
            }
        } catch (err) {
            // Try as cleartext
            const msgText = await messageFile.text()
            try {
                const message = await readCleartextMessage({ cleartextMessage: msgText })
                const verificationResult = await verify({
                    message,
                    verificationKeys: key
                })

                const signature = await checkValidation(verificationResult)

                if (signature) {
                    alert(`Signature verified! ID: ${signature.keyID.toHex().toUpperCase()}.`)
                } else {
                    alert('Signature invalid')
                }
            } catch (clearTextErr) {
                if (err instanceof Error && clearTextErr instanceof Error) {
                    alert(
                        `Invalid message file. Check if the file is correct, or provide an additional detached signature to validate the message file against. Potential Errors: ${err.message}. ${clearTextErr.message}`
                    )
                }
            }
        }
    } else if (messageText) {
        if (messageText.includes('BEGIN PGP SIGNED MESSAGE')) {
            const message = await readCleartextMessage({ cleartextMessage: messageText })
            const verificationResult = await verify({
                message,
                verificationKeys: key
            })

            const signature = await checkValidation(verificationResult)

            if (signature) {
                alert(`Signature verified! ID: ${signature.keyID.toHex().toUpperCase()}.`)
            } else {
                alert('Signature invalid')
            }
        } else if (messageText.includes('BEGIN PGP MESSAGE')) {
            const message = await readMessage({ armoredMessage: messageText })
            const verificationResult = await verify({
                message,
                verificationKeys: key
            })

            const signature = await checkValidation(verificationResult)

            if (signature) {
                alert(`Signature verified! ID: ${signature.keyID.toHex().toUpperCase()}.`)
            } else {
                alert('Signature invalid')
            }
        } else {
            alert(
                'For text input messages, please ensure the message starts with -----BEGIN PGP SIGNED MESSAGE----- OR -----BEGIN PGP MESSAGE-----'
            )
            return
        }
    } else {
        alert('Please provide the signed message.')
    }

    const dialog = form.closest('dialog')
    dialog?.close()
}

async function handleEncryptSubmit(e: Event) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const plaintext = formData.get('plaintext') as string
    const file = formData.get('file') as File
    const mainKeyId = formData.get('mainKeyId') as string

    const key = pgpKeys.find((k) => k.getKeyID().toHex().toUpperCase() === mainKeyId)
    if (!key) {
        alert('Recipient key not found.')
        return
    }

    try {
        let message: Message<Uint8Array | string>
        let filename = 'message.txt'
        if (file && file.size > 0) {
            const fileData = new Uint8Array(await file.arrayBuffer())
            message = await createMessage({ binary: fileData, filename: file.name })
            filename = `${file.name}.gpg`
        } else if (plaintext) {
            message = await createMessage({ text: plaintext })
            filename = 'message.asc'
        } else {
            alert('Please provide text or a file to encrypt.')
            return
        }

        const encrypted = await encrypt({
            message,
            encryptionKeys: key
        })

        const blob = new Blob([encrypted as string], { type: 'application/pgp-encrypted' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    } catch (err) {
        if (err instanceof Error) {
            alert(`Encryption failed: ${err.message}`)
        }
    }

    const dialog = form.closest('dialog')
    dialog?.close()
}

function handleAuthSubmit(e: Event) {
    e.preventDefault()
    // Stub: implement actual authentication/copy
    alert('Authenticate action submitted (SSH export not implemented)')

    const form = e.currentTarget as HTMLFormElement
    const dialog = form.closest('dialog')
    dialog?.close()
}
</script>

<PageHead
    description="My (cryptographic) identities"
    title="My Identities"
></PageHead>

{#snippet keyActions(key: Key)}
    {@const id = key.getKeyID().toHex().toUpperCase()}
    {@const caps = await getKeyCapabilities(key)}

    {#if caps.sign}
        <button class="btn btn-primary" command="show-modal" commandfor={`validate-${id}`} disabled={!browser}>
        Validate
        </button>

        <dialog id={`validate-${id}`}>
            <form method="dialog" onsubmit={handleValidateSubmit}>
                <input type="hidden" name="mainKeyId" value={id} />

                <h3>Validate Signature</h3>
                <fieldset>
                    <legend>Message</legend>
                    <label for={`validate-message-${id}`}>
                        <span>Message Text</span>
                    </label>
                    <textarea name="message" id={`validate-message-${id}`} rows="4" placeholder="Enter message"></textarea>
                </fieldset>

                <fieldset>
                    <legend>Files</legend>
                    <label for={`validate-message-file-${id}`}>
                        <span>Message File</span>
                    </label>
                    <input name="messageFile" id={`validate-message-file-${id}`} type="file" accept="*/*" />
                </fieldset>

                <label for={`validate-signature-file-${id}`}>
                    <span>Signature File (optional)</span>
                </label>
                <input name="signatureFile" id={`validate-signature-file-${id}`} type="file" accept="*/*" />

                <div>
                    <button type="submit" class="btn btn-primary">Validate</button>
                    <button type="reset" class="btn btn-red" command="reset" commandfor={`auth-${id}`}>Reset</button>
                    <button type="button" class="btn btn-red" command="close" commandfor={`validate-${id}`}>Close</button>
                </div>
            </form>
        </dialog>
    {/if}

    {#if caps.encrypt}
        <button class="btn btn-primary" command="show-modal" commandfor={`encrypt-${id}`} disabled={!browser}>
        Encrypt
        </button>
        <dialog id={`encrypt-${id}`}>
            <form method="dialog" onsubmit={handleEncryptSubmit}>
                <input type="hidden" name="mainKeyId" value={id} />
                <h3>Encrypt Message</h3>

                <fieldset>
                    <legend>Message</legend>
                    <label for={`encrypt-message-${id}`}>
                        <span>Plaintext</span>
                    </label>
                    <textarea name="plaintext" id={`encrypt-message-${id}`} rows="4" placeholder="Enter plaintext"></textarea>
                </fieldset>

                <fieldset>
                    <legend>File</legend>
                    <label for={`encrypt-message-file-${id}`}>
                        <span>File (optional)</span>
                    </label>
                    <input name="file" id={`encrypt-message-file-${id}`} type="file" accept="*/*" />
                </fieldset>

                <div>
                    <button type="submit" class="btn btn-primary">Encrypt</button>
                    <button type="reset" class="btn btn-red" command="reset" commandfor={`auth-${id}`}>Reset</button>
                    <button type="button" class="btn btn-red" command="close" commandfor={`encrypt-${id}`}>Close</button>
                </div>
            </form>
        </dialog>
    {/if}

    {#if caps.auth}
        <button class="btn btn-primary" command="show-modal" commandfor={`auth-${id}`} disabled={!browser}>
        Authenticate
        </button>

        <dialog id={`auth-${id}`}>
            <form method="dialog" onsubmit={handleAuthSubmit}>
                <input type="hidden" name="mainKeyId" value={id} />
                <h3>Authenticate</h3>
                <p>Authentication via PGP is typically handled via SSH agent or similar tools. This button is a placeholder for potential future functionality or instructions.</p>

                <div>
                    <button type="submit" class="btn btn-primary">Authenticate</button>
                    <button type="button" class="btn btn-red" command="close" commandfor={`auth-${id}`}>Close</button>
                </div>
            </form>
        </dialog>
    {/if}
{/snippet}


<section id="identities">
    <h1>My (cryptographic) identities</h1>

    <section id="gpg">
        <h2>PGP Keys</h2>

        {#each pgpKeys as key}
            {@const primaryUser = await key.getPrimaryUser()}
            {@const allUsersExceptPrimary = key.users.filter(user => user !== primaryUser.user)}
            <details>
                <summary>
                    <code>{keyFlagsToString(primaryUser.selfCertification?.keyFlags)} (0x{key.getKeyID().toHex().toUpperCase()})</code>
                </summary>
                <dl>
                    <dt>Key ID</dt>
                    <dd><code>{key.getKeyID().toHex().toUpperCase()}</code> <button onclick={() => navigator.clipboard.writeText(key.getKeyID().toHex().toUpperCase())} class="btn btn-primary">Copy</button></dd>
                    <dt>Fingerprint</dt>
                    <dd><code>{key.getFingerprint()}</code> <button onclick={() => navigator.clipboard.writeText(key.getFingerprint())} class="btn btn-primary">Copy</button></dd>
                    <dt>Actions</dt>
                    <dd>
                        {@render keyActions(key)}
                        <noscript>
                            <p>
                                JS Disabled. Actions are not available.
                            </p>
                        </noscript>
                    </dd>
                    <dt>Download</dt>
                    <dd><a class="btn btn-primary" href="https://keys.openpgp.org/vks/v1/by-keyid/{key.getKeyID().toHex().toUpperCase()}">Download Key</a></dd>
                </dl>

                {#if key.subkeys.length}
                    <section>
                        <h3>Subkeys</h3>
                        <ul>
                            {#each key.getSubkeys() as subkey}
                                {@const mainBindingSignature = subkey.bindingSignatures.find(bindingSignature => bindingSignature.issuerKeyID.bytes === key.getKeyID().bytes)}
                                <li>
                                    <details>
                                        <summary>{keyFlagsToString(mainBindingSignature?.keyFlags)} (<code>0x{subkey.getKeyID().toHex().toUpperCase()}</code>)</summary>
                                        <dl>
                                            <dt>Key ID</dt>
                                            <dd><code>{subkey.getKeyID().toHex().toUpperCase()}</code> <button onclick={() => navigator.clipboard.writeText(subkey.getKeyID().toHex().toUpperCase())} class="btn btn-primary">Copy</button></dd>
                                            <dt>Subkey Fingerprint</dt>
                                            <dd><code>{subkey.getFingerprint()}</code> <button onclick={() => navigator.clipboard.writeText(subkey.getFingerprint())} class="btn btn-primary">Copy</button></dd>
                                        </dl>
                                    </details>
                                </li>
                            {/each}
                        </ul>
                    </section>
                {/if}

                {#if key.users.length}
                    <section>
                        <h3>Users</h3>

                        <h4>Primary User</h4>
                        <dl>
                            <dt>Name</dt>
                            <dd><code>{primaryUser.user.userID?.name}</code></dd>
                            <dt>User Email</dt>
                            <dd><code>{primaryUser.user.userID?.email}</code></dd>
                            <dt>Comment</dt>
                            <dd><code>{primaryUser.user.userID?.comment}</code></dd>
                        </dl>

                        <h4>Other Users</h4>
                        <ul>
                            {#each allUsersExceptPrimary as user}
                                <li>
                                    <dl>
                                        <dt>Name</dt>
                                        <dd><code>{user.userID?.name}</code></dd>
                                        <dt>User Email</dt>
                                        <dd><code>{user.userID?.email}</code></dd>
                                        <dt>Comment</dt>
                                        <dd><code>{user.userID?.comment}</code></dd>
                                    </dl>
                                </li>
                            {/each}
                        </ul>
                    </section>
                {/if}
            </details>
        {/each}
    </section>

    <section id="ssh">
        <h2>SSH Keys</h2>
    </section>
</section>



<style>
    #identities {
        margin: 0.5rem 1.5rem;
        font-size: 1.25rem;

        display: grid;

        grid-template-areas: 'title'
                             'gpg'
                             'ssh';

        gap: 2rem;

        @media (min-width: 640px) {
            grid-template-columns: 1fr 1fr;
            grid-template-areas: 'title title'
                                 'gpg ssh';
        }

        h1 {
            grid-area: title;
        }

        #gpg {
            grid-area: gpg;
        }

        #ssh {
            grid-area: ssh;
        }
    }

    details {
        background: var(--surface);
        border: 2px solid var(--base-100);
        padding: 1rem;
        border-radius: 1rem;

        section {
            margin-top: 1.5rem;
            border-top: 1px solid var(--base-100);
            padding-top: 1rem;
        }
    }

    dl {
        display: grid;
        grid-template-columns: max-content auto;
        align-items: center;
        column-gap: 1rem;
    }

    dt {
        font-weight: bold;
    }

    dd {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 1ch;
    }

    ul {
        list-style: none;
        padding: 0;
        padding-top: 1rem;
    }

    li {
        margin-bottom: 1rem;
    }

    button, a.btn {
        text-decoration: none;
        margin: 0;
        font-size: 0.875rem;
        display: inline;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
    }

    dialog {
        margin: auto;
        background: var(--overlay);
        border: 2px solid var(--base-100);
        border-radius: 1rem;
        padding: 1rem;
    }

    fieldset {
        display: flex;
        flex-direction: column;
    }
</style>
