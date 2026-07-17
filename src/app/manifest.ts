import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'IngPhrase',
		short_name: 'IngPhrase',
		description: 'Ingush-Russian phrasebook',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#ee8c2b',
		orientation: 'portrait',
		scope: '/',
		icons: [
			{
				src: '/icons/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512-maskable.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
		categories: ['education', 'utilities'],
		lang: 'ru',
	};
}
