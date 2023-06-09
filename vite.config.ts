import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from '@unocss/svelte-scoped/vite'
import type { UserConfig } from 'vite';
import { imagetools, setMetadata, type OutputFormat, type TransformFactory, type Picture } from 'vite-imagetools'
import { createPlaceholder } from './placeholder';

const placeholderTransform: TransformFactory = (config) => {
	return async function (image) {
		if (!('lqip' in config)) return image;

		/** @ts-expect-error it's a string */
		const href = await createPlaceholder(image.options.input.file);
		setMetadata(image, 'lqip', href);
		return image;
	};
};

const pictureProxy = (a: OutputFormat | undefined): OutputFormat => {
	return function (metadatas) {
		if(!a) throw new Error('No picture format');

		const pictureFormat = a(metadatas);
		return async function (imageConfig) {
			const picture = pictureFormat(imageConfig) as Picture;
			// @ts-expect-error if it isn't there something is wrong
			return { ...picture, lqip: imageConfig[0].lqip };
		};
	};
};

const config: UserConfig = {
	plugins: [
		UnoCSS(),
		imagetools({
			extendOutputFormats: (builtins) => {
				return { ...builtins, picture: pictureProxy(builtins.picture) };
			},
			extendTransforms: (builtins) => {
				return [placeholderTransform, ...builtins];
			},
			defaultDirectives: (url) => {
				if (url.searchParams.has('optimize')) {
					/** @ts-expect-error we can pass in booleans */
					return new URLSearchParams({
						w: url.searchParams.get('w') || '1920;1366;780;414',
						format: 'avif;webp;jpg',
						as: 'picture',
						lqip: true
					});
				}
				return new URLSearchParams();
			}
		}),
		sveltekit(),
	],
};

export default config;
