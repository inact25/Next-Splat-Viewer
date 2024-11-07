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
  const slug = params.path as string;
  try {
    const data = await getData(slug);
    if (!data?.responseObject?.splat?.storage_url) {
      return <div>Failed to load file</div>;
    }

    const { storage_url, is_animated } = data.responseObject.splat;
    const { logo_url } = data.responseObject.company;
    return (
      <>
        <GaussianSplat
          src={storage_url}
          isAnimate={is_animated}
          thumbnail={logo_url}
        />
      </>
    );
  } catch (error) {
    return <div>Failed to load file</div>;
  }
};

export default Page;
