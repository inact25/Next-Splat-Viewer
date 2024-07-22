'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import GaussianSplat from '@/app/components/GaussianSplat';

const Page = () => {
  const params = useParams();
  return (
    <>
      <GaussianSplat src={params.path as string} />
    </>
  );
};

export default Page;
