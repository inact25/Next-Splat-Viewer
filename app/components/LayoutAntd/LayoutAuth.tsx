'use client';
import React, { useState } from 'react';
import { Button, Col, Layout, Menu, Row, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingFilled,
} from '@ant-design/icons';
import Image from 'next/image';

const { Sider, Header, Content } = Layout;

const LayoutAuth = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin';
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: colorBgContainer,
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: '64px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image src="/logo.png" alt="logo" width={64} height={64} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <SettingFilled />,
              label: 'Your Splat Files',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row justify="space-between" gutter={[10, 10]}>
            <Col>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col>
              <Button type="text" danger onClick={handleLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAuth;
