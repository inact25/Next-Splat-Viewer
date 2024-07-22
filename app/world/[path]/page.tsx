'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import GaussianSplat from '@/app/components/GaussianSplat';
import { getFile } from '@/app/actions/http';

const Page = async () => {
  const params = useParams();
  const id = params.path as string;
  const loadFile = await getFile(id);
  return (
    <>
      <GaussianSplat src={loadFile.responseObject} />
    </>
  );
};

export default Page;
