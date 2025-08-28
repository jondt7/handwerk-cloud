// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(); // liest next-intl.config.ts automatisch

const nextConfig = {
  reactStrictMode: true
};

export default withNextIntl(nextConfig);
