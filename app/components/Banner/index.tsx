'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Index = ({ title, description }: any) => {
  const [value, setValue] = useState('');

  const router = useRouter();
  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:flex-wrap lg:h-screen lg:items-center justify-center">
        <div>
          <div className="w-full mb-5">
            <Image
              className="m-auto"
              width={150}
              height={50}
              src="/logo.png"
              alt=""
            />
          </div>
          <div className="mx-auto max-w-3xl text-center w-full">
            <h1 className="pb-5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              {title}
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              {description}
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4 ">
              <label
                htmlFor="your-world"
                className="w-full relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <input
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  type="text"
                  id="your-world"
                  placeholder=""
                  className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />
                <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 dark:text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                  World Source (.splat)
                </span>
              </label>

              <button
                className="block mt-5 w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                onClick={() => {
                  localStorage.setItem('atob', value);
                  router.push('/generate/' + btoa(value));
                }}
              >
                View in Another Vision
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
