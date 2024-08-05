import React from 'react';
import dynamic from 'next/dynamic';
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Greenview - Viewer ',
  description: 'Greenview - Viewer',
}

const GaussianSplat = dynamic(() => import('@/app/components/GaussianSplat'), {
  ssr: false,
  // loading: false,
});
const Page = async (props: any) => {
  const { params } = props;
  if (typeof params.splat === 'string' && params.splat.includes(".splat")) {
    return (
        <>
          <GaussianSplat src={`https://api-gv.ciptadusa.com/bridge/${params.company}/${params.splat}`}/>
        </>
    );
  } else {
    return <div>Failed to load file</div>;
  }
};

export default Page;
