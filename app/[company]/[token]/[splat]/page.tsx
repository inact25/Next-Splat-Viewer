import React from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { API_URL } from '@/app/constant/config';

export const metadata: Metadata = {
  title: 'Greenview - Viewer ',
  description: 'Greenview - Viewer',
};

const GaussianSplat = dynamic(() => import('@/app/components/GaussianSplat'), {
  ssr: false,
  // loading: false,
});

const getData = async (company: string, splat: string) => {
  const res = await fetch(`${API_URL}/bridge/data/${company}/${splat}`, {
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

const Page = async (props: any) => {
  const { params } = props;
  const data = await getData(params.token, params.splat);
  const { storage_url, is_animated } = data.responseObject.splat;
  const { logo_url, domain } = data.responseObject.company;
  return (
    <>
      <meta
        httpEquiv="Content-Security-Policy"
        content={`default-src 'self'; frame-ancestors 'self' ${domain};`}
      />
      <GaussianSplat
        src={storage_url}
        isAnimate={is_animated}
        thumbnail={logo_url}
      />
    </>
  );
};

export default Page;
