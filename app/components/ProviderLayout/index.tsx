import { ConfigProvider } from 'antd';
import React from 'react';

type Props = {
  children: React.ReactNode;
};
const ProviderLayout = ({ children }: Props) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#173B45',
        borderRadius: 8,
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default ProviderLayout;
