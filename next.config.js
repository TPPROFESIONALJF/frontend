/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	  },
	  basePath: '/frontend',
	  assetPrefix: '/frontend',
	  trailingSlash: true,
	  headers: () => [
		{
		  source: '/:path*',
		  headers: [
			{
			  key: 'Cache-Control',
			  value: 'no-store',
			},
		  ],
		},
	  ]
};

module.exports = nextConfig;
