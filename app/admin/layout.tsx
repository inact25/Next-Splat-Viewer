import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React from 'react';
import ProviderLayout from '@/app/components/ProviderLayout';

export const metadata: Metadata = {
  icons: '/greenview.jpeg',
  title: 'Greenview',
  description: 'Experience your world in a whole new light.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ProviderLayout>{children}</ProviderLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
