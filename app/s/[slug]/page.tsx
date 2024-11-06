import React from 'react';
import dynamic from 'next/dynamic';
import { API_URL } from '@/app/constant/config';

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
  const { storage_url, is_animated } = data.responseObject.splat;
  const { logo_url } = data.responseObject.company;
  return (
    <>
      {Object.keys(data) && (
        <GaussianSplat
          src={storage_url}
          isAnimate={is_animated}
          thumbnail={logo_url}
        />
      )}
    </>
  );
};

export default Page;
