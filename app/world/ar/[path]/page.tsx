import React from 'react';
import { getFile } from '@/app/actions/http';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenview - Viewer ',
  description: 'Greenview - Viewer',
};

const GaussianSplatAR = dynamic(
  () => import('@/app/components/GaussianSplatAR'),
  {
    ssr: false,
    // loading: false,
  },
);
const Page = async (props: any) => {
  const { params } = props;
  const id = params.path as string;
  try {
    const loadFile = await getFile(id);
    return (
      <>
        <GaussianSplatAR src={loadFile.responseObject} />
      </>
    );
  } catch (error) {
    return <div>Failed to load file</div>;
  }
};

export default Page;
