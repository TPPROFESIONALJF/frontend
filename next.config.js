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
	  async headers() {
		return [
		  {
			source: '/:path*',
			headers: [
			  {
				key: 'x-hello',
				value: 'there',
			  },
			],
		  },
		  {
			source: '/hello',
			headers: [
			  {
				key: 'x-hello',
				value: 'world',
			  },
			],
		  },
		]
	  },
};

module.exports = nextConfig;
