/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Banner from '@/app/components/Banner';
import Image from 'next/image';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Greenview - Viewer ',
  description: 'Greenview - Viewer',
};

const Home = async () => {
  return (
    <>
      <div className="bg-gray-900 p-5 xl:p-10 text-white">
        <Banner
          title={'Experience your world in a whole new light.'}
          description={
            'The world looks different from imaginative perspectives. By expanding our views, we can discover new ways to understand reality.'
          }
        />
      </div>
      <footer className="bg-gray-900">
        <div className="mx-auto px-12 py-8 ">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex justify-center text-teal-600 sm:justify-start">
              <Image width={150} height={50} src="/logo.png" alt="greenview" />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
              Copyright &copy; 2024. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
