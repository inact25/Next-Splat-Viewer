'use client';
import React, { useEffect, useState } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { Camera } from 'three';
import Image from 'next/image';
import {className} from "postcss-selector-parser";

export default function GaussianSplat({
                                        src,
                                        isAnimate,
                                        thumbnail,
                                        className
                                      }: {
  src: string;
  camera?: Camera;
  isAnimate?: boolean;
  thumbnail?: string;
  className?:string
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [rootElementId] = useState(
    `gaussian-splat-viewer-${Math.random().toString(36).substring(2)}`
  );

  useEffect(() => {
    const rootElement = document.getElementById(rootElementId);
    if (!rootElement) return;

    // Cleanup existing canvas if any
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }

    const viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0, -1, 0],
      initialCameraPosition: [-8, -2, -4],
      initialCameraLookAt: [0, 0, 0],
      sphericalHarmonicsDegree: 2,
      rootElement: rootElement,
      sharedMemoryForWorkers: false,
      sceneRevealMode: isAnimate ? GaussianSplats3D.SceneRevealMode.Instant : GaussianSplats3D.SceneRevealMode.Gradual,
    });

    viewer
      .addSplatScene(src, {
        position: [0, 2.5, 0],
        streamView: true,
        showLoadingUI: false,
      })
      .then(() => {
        viewer.start();
        viewer.perspectiveControls.stopListenToKeyEvents();
        viewer.orthographicControls.stopListenToKeyEvents();
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });

    return () => {
      viewer.stop();
    };
  }, [rootElementId, src]);

  return (
    <>
      {isLoading &&
        <div className={`${className} min-h-[100dvh] absolute z-9999 w-full flex justify-center items-center bg-[#233736]`}>
          <div>
            {!!thumbnail?.length ?
              <img src={thumbnail} className='mb-10 rounded-lg' alt="logo" style={{ width: 150, height: 150 }} />
              :
              <Image width={200} height={200} alt="loading logo" src={'/greenview.jpeg'} />
            }
            <div role="status" className="text-center flex justify-center gap-5 items-center text-[#98b8a7]">
              <svg aria-hidden="true"
                   className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                   viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor" />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill" />
              </svg>
              <div>Loading...</div>
            </div>
          </div>
        </div>
      }
      <div className="h-full w-full" id={rootElementId}></div>

    </>
  );
}
