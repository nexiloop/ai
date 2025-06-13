import { MetadataRoute } from 'next'
import { APP_DOMAIN } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/'],
    },
    sitemap: `${APP_DOMAIN}/sitemap.xml`,
  }
}
