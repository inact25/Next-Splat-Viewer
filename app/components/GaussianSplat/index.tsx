'use client';
import React, { useEffect, useState } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { Camera } from 'three';

export default function GaussianSplat({
  src,
}: {
  src: string;
  camera?: Camera;
}) {
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
    });

    viewer
      .addSplatScene(src, {
        position: [0, 2.5, 0],
        streamView: true,
        showLoadingUI: true,
      })
      .then(() => {
        viewer.start();
        viewer.perspectiveControls.stopListenToKeyEvents();
        viewer.orthographicControls.stopListenToKeyEvents();
      });

    return () => {
      viewer.stop();
    };
  }, [rootElementId, src]);

  return <div className="h-full w-full" id={rootElementId}></div>;
}
