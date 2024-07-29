'use client';
import React, { useEffect, useState } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { Camera, Quaternion, Vector3 } from 'three';

export default function GaussianSplatAR({
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

    // Cleanup existing canvas if any
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }

    const viewer = new GaussianSplats3D.Viewer({
      initialCameraLookAt: [0.20786, -0.68154, -0.27311],
      webXRMode: GaussianSplats3D.WebXRMode.AR,
    });

    viewer
      .addSplatScene(src, {
        position: [0, 2.5, 0],
        rotation: new Quaternion()
          .setFromUnitVectors(
            new Vector3(0.01933, -0.7583, -0.65161).normalize(),
            new Vector3(0, 1, 0),
          )
          .toArray(),
        scale: [0.25, 0.25, 0.25],
      })
      .then(() => {
        viewer.start();
      });

    return () => {
      viewer.stop();
    };
  }, [rootElementId, src]);

  return <div className="h-full w-full" id={rootElementId}></div>;
}
