import React from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { API_URL } from '@/app/constant/config';

export const metadata: Metadata = {
  title: 'Greenview - Viewer ',
  description: 'Greenview - Viewer',
}

const GaussianSplat = dynamic(() => import('@/app/components/GaussianSplat'), {
  ssr: false,
  // loading: false,
});

const getData = async (company: string, splat:string) => {
  const res = await fetch(`${API_URL}/bridge/${company}/${splat}`);
  return res.json();

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

const Page = async (props: any) => {
  const { params } = props;
  const data = await getData(params.token, params.splat);
  const { storage_url, is_animated } = data.responseObject.splat;
  const { logo_url } = data.responseObject.company;

  const isAllowedIframe = () => {
    const allowedDomains = [logo_url];
    const referrer = document.referrer;

    if (referrer) {
      const referrerDomain = (new URL(referrer)).hostname;
      return window.self !== window.top && allowedDomains.includes(referrerDomain);
    }
    return false;
  };


  // if (isAllowedIframe()) {
    return (
        <>
          <GaussianSplat src={storage_url} isAnimate={is_animated} thumbnail={logo_url} />
        </>
    );
  // } else {
  //   return <div>Your Sites doesn&apos;t have permission to show this file</div>;
  // }
};

export default Page;
