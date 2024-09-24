import React from 'react';
import dynamic from 'next/dynamic';
import { API_URL } from '@/app/constant/config';
import Head from 'next/head';

const GaussianSplat = dynamic(() => import('@/app/components/GaussianSplat'), {
  ssr: false,
  // loading: false,
});

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

const Page = async (props: any) => {
  const { params } = props;
  const data = await getData(params.slug);
  const { storage_url, is_animated, title, description } =
    data.responseObject.splat;
  const { logo_url } = data.responseObject.company;
  const logo = logo_url !== '' ? logo_url : '/greenview.jpeg';
  console.log(storage_url, is_animated, title, description);
  return (
    <>
      <Head>
        <title>{title || 'Greenview - Viewer'}</title>
        <meta name="description" content={description || '3D models viewer'} />
        <link rel="icon" href={logo} />
        <meta property="og:title" content={title || 'Greenview - Viewer'} />
        <meta
          property="og:description"
          content={description || '3D models viewer'}
        />
        <meta property="og:image" content={logo} />
        <meta property="og:type" content="website" />
      </Head>
      {Object.keys(data) && (
        <GaussianSplat
          src={storage_url}
          isAnimate={is_animated}
          thumbnail={logo_url}
          mode={'None'}
        />
      )}
    </>
  );
};

export default Page;
