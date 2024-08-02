'use client';
import { useEffect, useState } from 'react';

interface AccelerometerReadings {
  x: number | null;
  y: number | null;
  z: number | null;
}

interface UseAccelerometerOptions {
  frequency?: number;
}

const useAccelerometer = ({
  frequency,
}: UseAccelerometerOptions = {}): AccelerometerReadings => {
  const [linearAcceleration, setLinearAcceleration] =
    useState<AccelerometerReadings>({
      x: 0,
      y: 0,
      z: 0,
    });

  useEffect(() => {
    // @ts-ignore
    let sensor: Accelerometer | null = null;

    try {
      sensor = new (window as any).Accelerometer({ frequency });

      if (sensor) {
        sensor.start();
        sensor.onreading = () => {
          const readings: AccelerometerReadings = {
            x: sensor!.x,
            y: sensor!.y,
            z: sensor!.z,
          };

          setLinearAcceleration(readings);
        };

        sensor.onerror = (event: Event) => {
          console.error(
            (event as any).error.name,
            (event as any).error.message,
          );
          setLinearAcceleration({
            x: null,
            y: null,
            z: null,
          });
        };
      }
    } catch (error) {
      console.error('Accelerometer not supported or an error occurred:', error);
      setLinearAcceleration({
        x: null,
        y: null,
        z: null,
      });
    }

    return () => {
      sensor?.stop();
    };
  }, [frequency]);

  return linearAcceleration;
};

export default useAccelerometer;
