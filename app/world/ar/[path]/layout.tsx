import { Metadata } from 'next';
import Script from 'next/script';
import { API_URL } from '@/app/constant/config';
import React from 'react';

export const metadata: Metadata = {
  title: 'Greenview - AR ',
  description: 'Greenview - AR',
};
const getData = async () => {
  const res = await fetch(`${API_URL}/bridge/get_variant`);
  if (!res.ok) {
    console.log(res, API_URL);
    throw new Error('Failed to fetch data');
  }
  return res.json();
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getData();
  if (!data?.responseObject?.meta_value) {
    return <div>Failed to load file</div>;
  }

  const { meta_value } = data.responseObject;
  return (
    <>
      <Script
        src={`https://launchar.app/sdk/v1?key=${meta_value}&redirect=true`}
      />
      {children}
    </>
  );
}
