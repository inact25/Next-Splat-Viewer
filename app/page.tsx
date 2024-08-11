import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenview - Viewer ',
  description: 'Greenview - Viewer',
};

const Home = async () => {
  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900">
        <div className="absolute animate-bounce z-10 w-full h-[50%] flex justify-center items-end bg-gray-900">
          <h1 className="sm:text-9xl text-7xl font-extrabold animate-[wiggle_1s_ease-in-out_infinite] text-white font-mono">
            Coming
          </h1>
        </div>
        <div className="absolute w-full h-[50%] flex items-end justify-center bg-gray-900">
          <h1 className="sm:text-7xl text-5xl animate-[wiggle_1s_ease-in-out_infinite] text-center text-white font-extrabold">
            Soon
          </h1>
        </div>
      </div>
      {/*<div className="bg-gray-900 p-5 xl:p-10 text-white">*/}
      {/*  <Banner*/}
      {/*    title={'Experience your world in a whole new light.'}*/}
      {/*    description={*/}
      {/*      'The world looks different from imaginative perspectives. By expanding our views, we can discover new ways to understand reality.'*/}
      {/*    }*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<footer className="bg-gray-900">*/}
      {/*  <div className="mx-auto px-12 py-8 ">*/}
      {/*    <div className="sm:flex sm:items-center sm:justify-between">*/}
      {/*      <div className="flex justify-center text-teal-600 sm:justify-start">*/}
      {/*        <Image width={150} height={50} src="/logo.png" alt="greenview" />*/}
      {/*      </div>*/}
      {/*      <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">*/}
      {/*        Copyright &copy; 2024. All rights reserved.*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</footer>*/}
    </>
  );
};

export default Home;
