import React from 'react';
import dynamic from 'next/dynamic';

const GaussianSplat = dynamic(() => import('@/app/components/GaussianSplat'), {
  ssr: false,
  // loading: false,
});
const Page = (props: any) => {
  const { params } = props;
  return (
    <>
      <GaussianSplat src={params.path as string} />
    </>
  );
};

export default Page;
