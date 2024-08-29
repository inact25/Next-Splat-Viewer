import Script from 'next/script'
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://launchar.app/sdk/v1?key=wq218Ks333kuBXLbT2XZ4hJjeLGGZMnN&redirect=true"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
