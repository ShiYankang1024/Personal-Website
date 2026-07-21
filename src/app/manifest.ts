// app/manifest.ts

import type { MetadataRoute } from 'next';


export const dynamic = 'force-static';


export default function manifest(): MetadataRoute.Manifest {

  return {

    name:
      'DMKant个人网站',

    short_name:
      'DMKant',

    description:
      'DMKant个人网站，展示软件开发、设计和数字项目。',

    start_url:
      '/',

    display:
      'standalone',

    background_color:
      '#000000',

    theme_color:
      '#000000',

  };

}