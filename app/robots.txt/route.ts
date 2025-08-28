// app/robots.txt/route.ts
export function GET() {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
    const body = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
    return new Response(body, { headers: { 'content-type': 'text/plain' } });
  }
  