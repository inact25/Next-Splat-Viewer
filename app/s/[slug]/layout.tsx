import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { API_URL, FRONTEND_URL } from '@/app/constant/config';

const inter = Inter({ subsets: ['latin'] });

const getData = async (slug: string) => {
  const res = await fetch(`${API_URL}/bridge/slug/${slug}`, {
    cache: 'no-cache',
  });
  if (!res.ok) {
    console.log(res, API_URL, slug);
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export async function generateMetadata({ params }: any) {
  const data = await getData(params.slug);

  const { title, description } = data.responseObject.splat;
  const { logo_url } = data.responseObject.company;
  const logo = logo_url !== '' ? logo_url : `${FRONTEND_URL}/greenview.jpeg`;
  const metaTitle = title || 'Greenview';
  const metaDescription = description || '3D models viewer';
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: logo,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      type: 'website',
      url: `${FRONTEND_URL}/s/${params.slug}`,
    },
    icons: {
      icon: logo,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
