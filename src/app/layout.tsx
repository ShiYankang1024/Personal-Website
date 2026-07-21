import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {

  title:
    'DMKant | DM Kant个人网站',

  description:
    'DMKant个人网站，DM Kant的数字空间，分享技术、设计、开发与个人项目。',

  keywords:[
    'DMKant',
    'DM Kant',
    'DMKant个人网站',
    'DMKant个人空间',
    'DMKant官网',
    'DM Kant网站',
    'dmkdspace'
  ],


  authors:[
    {
      name:'DMKant'
    }
  ],


  creator:'DMKant',


  metadataBase:
    new URL('https://dmkdspace.tech'),


  alternates:{
    canonical:'/'
  },


  openGraph:{

    title:
    'DMKant | DM Kant个人网站',

    description:
    'DMKant个人网站，分享技术、设计和数字项目。',

    url:
    'https://dmkdspace.tech',

    siteName:
    'DMKant',

    locale:
    'zh_CN',

    type:
    'website'

  },


  robots:{
    index:true,
    follow:true
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
          <body className="dmkant">
            {children}
            <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({

                "@context": "https://schema.org",

                "@graph": [

                    {

                    "@type": "Person",

                    "@id":
                    "https://dmkdspace.tech/#person",

                    "name":
                    "DMKant",

                    "alternateName":
                    [
                        "DM Kant",
                        "DMKant个人网站"
                    ],

                    "url":
                    "https://dmkdspace.tech",

                    "jobTitle":
                    "软件开发工程师",

                    "description":
                    "DMKant个人网站，分享软件开发、Web技术、3D可视化和数字项目。",

                    "knowsAbout":[
                        "Web开发",
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Three.js",
                        "Unity",
                        "WebGIS"
                    ]

                    },


                    {

                    "@type":
                    "WebSite",

                    "@id":
                    "https://dmkdspace.tech/#website",

                    "url":
                    "https://dmkdspace.tech",

                    "name":
                    "DMKant | DM Kant个人网站",

                    "description":
                    "DMKant个人网站，展示技术、设计和个人项目。",

                    "publisher":
                    {
                        "@id":
                        "https://dmkdspace.tech/#person"
                    }

                    }


                ]

                })
            }}
            />


            </body>
    </html>
  );
}
