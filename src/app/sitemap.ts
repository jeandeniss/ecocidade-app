import { MetadataRoute } from 'next'
import { ecoStores } from '@/lib/mapData'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eco-product-scanner.com'

  // Generate store URLs
  const storeUrls = ecoStores.map((store) => ({
    url: `${baseUrl}/stores/${store.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...storeUrls,
  ]
}