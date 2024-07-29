/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Banner from '@/app/components/Banner';
import Link from 'next/link';
import Image from 'next/image';
import { listFiles } from '@/app/actions/http';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenview - Viewer ',
  description: 'Greenview - Viewer',
};

const Home = async () => {
  const response = await listFiles();
  return (
    <>
      <div className="bg-gray-900 p-5 xl:p-10 text-white">
        <Banner
          title={'Experience your world in a whole new light.'}
          description={
            'The world looks different from imaginative perspectives. By expanding our views, we can discover new ways to understand reality.'
          }
        />
        <div className="flex flex-wrap justify-center items-center">
          <div className="title w-full mb-16">
            <h1 className="text-white text-[36px] font-bold text-center">
              World Galleries
            </h1>
          </div>
          <div className="worldview grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-full gap-10">
            {response.responseObject.map((item, key) => (
              <div
                key={key}
                className="card p-3 border border-gray-800 rounded-2xl"
              >
                <img
                  className="rounded-2xl object-cover h-[450px]"
                  src={
                    item.thumbnail
                      ? item.thumbnail
                      : 'https://via.placeholder.com/800x600'
                  }
                  alt="thumb"
                />
                <div className="caption text-[14px] text-white text-center mt-4">
                  <h2 className="font-bold">{item.title}</h2>
                  <p>{item.descriptions}</p>
                </div>
                <div key={key} className="flex justify-center mt-4 gap-4">
                  <Link href={`/world/view/${item.id}`}>
                    <button className="block mt-5 w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto">
                      View
                    </button>
                  </Link>
                  <Link href={`/world/ar/${item.id}`}>
                    <button className="block mt-5 w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto">
                      AR
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
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
