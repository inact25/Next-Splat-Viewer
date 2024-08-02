'use client';

import React, { useState } from 'react';

type Props = {
  children?: any;
};
const Permissions: React.FC<Props> = ({ children }) => {
  const [granted, setGranted] = useState<boolean>(false);
  const onDenied = () => {
    alert('denied');
  };
  const onGranted = () => {
    setGranted(true);
  };

  const motionSensor = () => {
    if (navigator.userAgent.toLowerCase().includes('android')) {
      requestPermission();
    } else {
      // @ts-ignore
      DeviceMotionEvent.requestPermission()
        .then((response: any) => {
          if (response == 'granted') {
            requestPermission();
          }
        })
        .catch(() => {
          onDenied();
        });
    }
  };

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      onGranted();
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      if (
        // @ts-ignore
        error?.name === 'NotAllowedError' ||
        // @ts-ignore
        error?.name === 'PermissionDeniedError'
      ) {
        onDenied();
      } else {
        onDenied();
      }
    }
  };
  if (granted) {
    return children;
  }

  return (
    <div className={'flex flex-col items-center justify-center h-screen'}>
      <button
        className={
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        }
        onClick={motionSensor}
      >
        Request Permission
      </button>
    </div>
  );
};

export default Permissions;
