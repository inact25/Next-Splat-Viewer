'use client';

import httpClient from '@/app/actions/httpClient';
import { ListFilesResponse } from '@/app/actions/http';
import { useEffect, useState } from 'react';
import { Button, Card, message, Modal, Table, Upload, UploadProps } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const TableList = ({ url }: any) => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    action: `${url}/file/upload`,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        handleRefetch();
        setShowModal(false);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 <= 20;
      if (!isLt20M) {
        message.error('File must smaller than 20MB!');
      }
      return isLt20M;
    },
    accept: '.splat',
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
      title: 'File Name',
      dataIndex: 'id',
      key: 'file',
      render: (text: string) => {
        return `File-${text}`;
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
  ];
  const handleRefetch = () => {
    setRefetch(!refetch);
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
    console.log(listSplat);
  }, [listSplat]);
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
      />
      <Modal
        title="Add Splat"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
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
      </Modal>
    </Card>
  );
};

export default TableList;
