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
    `gaussian-splat-viewer-${Math.random().toString(36).substring(2)}`,
  );

  useEffect(() => {
    const rootElement = document.getElementById(rootElementId);
    if (!rootElement) return;
    const viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0, -1, -0.17],
      initialCameraPosition: [-5, -1, -1],
      initialCameraLookAt: [-1.72477, 0.05395, -0.00147],
      sphericalHarmonicsDegree: 2,
      rootElement: rootElement,
      sharedMemoryForWorkers: false,
    });

    viewer
      .addSplatScene(src, {
        streamView: true,
        showLoadingUI: true,
      })
      .then(() => {
        viewer.start();
        viewer.perspectiveControls.stopListenToKeyEvents();
        viewer.orthographicControls.stopListenToKeyEvents();
      });
  }, []);

  return <div className="h-full w-full" id={rootElementId}></div>;
}
