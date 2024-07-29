'use client';

import httpClient from '@/app/actions/httpClient';
import { ListFilesResponse } from '@/app/actions/http';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Upload,
  UploadProps,
} from 'antd';
import {
  CloudUploadOutlined,
  DeleteFilled,
  EditFilled,
} from '@ant-design/icons';

const { Dragger } = Upload;
const TableList = ({ url }: any) => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingFile, setEditingFile] = useState<ListFilesResponse | null>(
    null,
  );
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
      const response = await http.removeFile(id);
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
        values.title,
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
  const [listSplat, setListSplat] = useState<ListFilesResponse[]>([]);
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'descriptions',
      key: 'descriptions',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (text: string) => {
        return <img src={text} alt={text} style={{ width: 100 }} />;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => {
        return new Date(text).toLocaleDateString();
      },
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: ListFilesResponse) => (
        <Space direction="horizontal">
          <Button
            icon={<EditFilled />}
            onClick={() => setEditingFile(record)}
          />
          <Button
            danger
            icon={<DeleteFilled />}
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
      const response = await http.editFile(
        editingFile.id,
        values.file ? values.file[0].originFileObj : null,
        values.thumbnail ? values.thumbnail[0].originFileObj : null,
        values.title,
        values.descriptions,
      );
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
      const response = await http.listFiles();
      setListSplat(response.responseObject);
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
      title="Manage Splat"
      extra={
        <Button type="primary" onClick={() => setShowModal(true)}>
          Add Splat
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={listSplat}
        loading={loading}
        rowKey={(record) => record.id.toString()}
        scroll={{
          x: 768,
        }}
        pagination={false}
      />
      <Modal
        title="Add Splat"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpload}>
          <Form.Item
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Accept only .splat file and file size must be smaller than 20MB
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag thumbnail to this area to upload
              </p>
              <p className="ant-upload-hint">
                Accept only image files and file size must be smaller than 20MB
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            name="descriptions"
            rules={[
              { required: true, message: 'Please input the descriptions!' },
            ]}
          >
            <Input.TextArea placeholder="Descriptions" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Splat"
        open={!!editingFile}
        onCancel={() => setEditingFile(null)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit}>
          <Form.Item
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Accept only .splat file and file size must be smaller than 20MB
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag thumbnail to this area to upload
              </p>
              <p className="ant-upload-hint">
                Accept only image files and file size must be smaller than 20MB
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            name="descriptions"
            rules={[
              { required: true, message: 'Please input the descriptions!' },
            ]}
          >
            <Input.TextArea placeholder="Descriptions" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TableList;
