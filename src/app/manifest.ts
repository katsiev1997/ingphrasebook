import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'IngPhrase',
		short_name: 'IngPhrase',
		description: 'Ingush-Russian phrasebook',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		orientation: 'portrait',
		scope: '/',
		icons: [
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon',
			},
		],
		categories: ['education', 'utilities'],
		lang: 'ru',
	};
}
