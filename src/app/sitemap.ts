import type { MetadataRoute } from 'next';


export const dynamic = 'force-static';


export default function sitemap(): MetadataRoute.Sitemap {

  return [

    {
      url: 'https://dmkdspace.tech',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },

    {
      url: 'https://dmkdspace.tech/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

  ];

}