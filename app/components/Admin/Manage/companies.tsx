'use client';

import httpClient from '@/app/actions/httpClient';
import {ListFilesResponse} from '@/app/actions/http';
import {useEffect, useState} from 'react';
import {Button, Card, Form, Input, message, Modal, Space, Switch, Table, Tag, Upload, UploadProps,} from 'antd';
import {CloudUploadOutlined, DeleteFilled, EditFilled,} from '@ant-design/icons';

const {Dragger} = Upload;
const Companies = ({url}: any) => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingFile, setEditingFile] = useState<ListFilesResponse | null>(
      null,
  );
  const [params, setParams] = useState({limit: 10, page: 1})
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 <= 20;
      if (!isLt20M) {
        message.error('File must be smaller than 20MB!');
      }
      return isLt20M;
    },
    // accept: '.splat',
  };
  const handleRemove = async (id: number) => {
    try {
      setLoading(true);
      const response = await http.removeCompany(id);
      message.success('File removed successfully');
      handleRefetch();
    } catch (error) {
      message.error('File remove failed');
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async (values: any) => {
    try {
      setLoading(true);
      const response = await http.uploadFile(
          values.file[0].originFileObj,
          values.thumbnail[0].originFileObj,
          values.name,
          values.descriptions,
      );
      message.success('File uploaded successfully');
      handleRefetch();
      setShowModal(false);
    } catch (error) {
      message.error('File upload failed');
    } finally {
      setLoading(false);
    }
  };
  const http = httpClient(url);
  const [listCompanies, setListCompanies] = useState<ListFilesResponse[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Logo',
      dataIndex: 'logo_url',
      key: 'logo_url',
      render: (e: any) => <img style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '10rem'}} src={e}
                               alt="logo"/>
    },
    {
      title: 'Company name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (e: boolean) => <Tag color={e ? "green" : 'red'}>{e ? "Active" : "Nonactive"}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: ListFilesResponse) => (
          <Space direction="horizontal">
            <Button
                icon={<EditFilled/>}
                onClick={() => setEditingFile(record)}
            />
            <Button
                danger
                icon={<DeleteFilled/>}
                onClick={() => handleRemove(record.id)}
            />
          </Space>
      ),
    },
  ];
  const handleRefetch = () => {
    setRefetch(!refetch);
  };

  const handleEdit = async (values: any) => {
    if (!editingFile) return;
    try {
      setLoading(true);
      const uploadResp = await http.fileUploader(values.logo[0].originFileObj)
      const response = await http.editCompany({
        id: editingFile.id,
        logo_id: uploadResp.responseObject.id,
        name: values.name,
        status: values.status,
      });
      message.success('File edited successfully');
      handleRefetch();
      setEditingFile(null);
    } catch (error) {
      message.error('File edit failed');
    } finally {
      setLoading(false);
    }
  };
  const loadList = async () => {
    setLoading(true);
    try {
      const response = await http.listCompanies(params);
      setListCompanies(response.responseObject);
      console.log(handleRefetch);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [refetch]);
  useEffect(() => {
    if (editingFile) {
      editForm.setFieldsValue({
        title: editingFile.title,
        descriptions: editingFile.descriptions,
      });
    }
  }, [editingFile]);
  return (
      <Card
          title="Manage Companies"
          extra={
            <Button type="primary" onClick={() => setShowModal(true)}>
              Register New Company
            </Button>
          }
      >
        <Table
            columns={columns}
            dataSource={listCompanies}
            loading={loading}
            rowKey={(record) => record.id.toString()}
            scroll={{
              x: 768,
            }}
            pagination={false}
        />
        <Modal
            title="Register New Company"
            open={showModal}
            onCancel={() => setShowModal(false)}
            footer={null}
        >
          <Form form={form} onFinish={handleUpload}>
            <Form.Item
                name="logo"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
            >
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined/>
                </p>
                <p className="ant-upload-text">
                  Click or drag logo to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Accept only image files and file size must be smaller than 20MB
                </p>
              </Dragger>
            </Form.Item>
            <Form.Item
                name="name"
                rules={[{required: true, message: 'Please input the name!'}]}
            >
              <Input placeholder="Company Name"/>
            </Form.Item>
            <Form.Item
                style={{fontWeight: "bold", fontSize: 18}}
                label={"Status"}
                name={'status'}
                rules={[{required: true, message: 'Please set Token Status!'}]}>
              <Switch onChange={e => console.log("asu", e)} checkedChildren="Active" unCheckedChildren="Nonactive"
                      defaultChecked/>
            </Form.Item>
            {/*<Form.Item*/}
            {/*    name="descriptions"*/}
            {/*    rules={[*/}
            {/*      {required: true, message: 'Please input the descriptions!'},*/}
            {/*    ]}*/}
            {/*>*/}
            {/*  <Input.TextArea placeholder="Descriptions"/>*/}
            {/*</Form.Item>*/}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Register Company
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
            title="Edit Company"
            open={!!editingFile}
            onCancel={() => setEditingFile(null)}
            footer={null}
        >
          <Form form={editForm} onFinish={handleEdit}>
            <Form.Item
                name="logo"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
            >
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined/>
                </p>
                <p className="ant-upload-text">
                  Click or drag logo to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Accept only image files and file size must be smaller than 20MB
                </p>
              </Dragger>
            </Form.Item>
            <Form.Item
                name="name"
                rules={[{required: true, message: 'Please input the Name!'}]}
            >
              <Input placeholder="Company Name"/>
            </Form.Item>
            <Form.Item
                style={{fontWeight: "bold", fontSize: 18}}
                label={"Status"}
                name={'status'}
                rules={[{required: true, message: 'Please set Token Status!'}]}>
              <Switch onChange={e => console.log("asu", e)} checkedChildren="Active" unCheckedChildren="Nonactive"
                      defaultChecked/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Company
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
  );
};

export default Companies;
