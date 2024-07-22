'use client';
import React from 'react';
import { Button, Card, Col, Form, Input, message, Row, Typography } from 'antd';
import './LoginPage.css';
import httpClient from '@/app/actions/httpClient'; // Assuming you have a CSS file for styles

const Page = (props: any) => {
  const http = httpClient(process.env.NEXT_PUBLIC_API_URL as string);
  const [loading, setLoading] = React.useState<boolean>(false);
  const onFinish = (values: any) => {
    setLoading(true);
    http
      .login({
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        setLoading(false);
        localStorage.setItem('token', response.responseObject.token);
        window.location.href = '/admin/manage';
      })
      .catch((error) => {
        console.error(error);
        message.error('Login failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Card>
        <Row gutter={[10, 10]}>
          <Col xs={24}>
            <Typography.Title level={5}>Log in</Typography.Title>
          </Col>
          <Col xs={24}>
            <Typography.Text type="secondary">
              Welcome back! Please log in to continue.
            </Typography.Text>
          </Col>

          <Col xs={24}>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                    type: 'email',
                  },
                ]}
              >
                <Input size="large" placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={loading}
                  block
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Page;
