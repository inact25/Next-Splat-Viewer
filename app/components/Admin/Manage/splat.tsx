'use client';

import httpClient from '@/app/actions/httpClient';
import {ListFilesResponse} from '@/app/actions/http';
import {useEffect, useState} from 'react';
import {Button, Card, Form, Input, message, Modal, Select, Space, Table, Upload, UploadProps,} from 'antd';
import {CloudUploadOutlined, DeleteFilled, EditFilled,} from '@ant-design/icons';

const { Dragger } = Upload;
const Splat = ({url}: any) => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [companyId, setCompanyId] = useState(0)
  const [companyToken, setCompanyToken] = useState(0)
  const [companyData, setCompanyData] = useState({})
  const [editingFile, setEditingFile] = useState<ListFilesResponse | null>(
    null,
  );
  const [params, setParams] = useState({limit: 10, page: 1, company_id: 0})

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const fileSizeMB = file.size / 1000000; // Convert bytes to MB
      if (fileSizeMB > 20) {
        message.error('File size exceeds 20MB');
        return Upload.LIST_IGNORE; // Prevent upload and remove the file from the list
      }
      form.setFieldsValue({file: file})
      return false; // Prevent default upload behavior
    },

    accept: '.splat',
  };

  const propsThumbnail: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const fileSizeMB = file.size / 1000000; // Convert bytes to MB
      if (fileSizeMB > 20) {
        message.error('File size exceeds 20MB');
        return Upload.LIST_IGNORE; // Prevent upload and remove the file from the list
      }
      form.setFieldsValue({thumbnail: file})
      return false; // Prevent default upload behavior
    },

    // accept: '',
  };
  const handleRemove = async (id: number) => {
    try {
      setLoading(true);
      const response = await http.removeSplat(id);
      message.success('File removed successfully');
      handleRefetch();
    } catch (error) {
      message.error('File remove failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      setLoading(true);
      const splatFile = await http.fileUploader(values.file.file)
      const thumbnailFile = await http.fileUploader(values.thumbnail.file)
      const response = await http.createSplat({
        storage_id: splatFile.responseObject.id,
        title: values.title,
        description: values.description,
        thumbnail_id: thumbnailFile.responseObject.id,
        company_id: Number(companyId)
      });
      message.success('File Registered successfully');
      handleRefetch();
      setShowModal(false)
    } catch (error) {
      console.log(error)
      message.error('File Register failed');
    } finally {
      setLoading(false);
    }
  };


  const http = httpClient(url);
  const [listSplat, setListSplat] = useState<ListFilesResponse[]>([]);
  const [listCompany, setListCompany] = useState<any[]>([]);
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
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail_url',
      key: 'thumbnail_url',
      render: (text: string) => {
        return <img src={text} alt={text} style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '10rem'}} />;
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
      title: 'Embed Url',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string, record:any) => <Button onClick={() => {
        navigator.clipboard.writeText(`https://${window.location.hostname}/world/${companyToken}/${record.id}.splat`).then(() => {
          message.success('Copied to Clipboard');
        }).catch(err => {
          message.error('Could not copy text: ', err);
        });
      }}>Copy Embeded Url</Button>
    },
    {
      title: 'Embed Script',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string, record:any) => <Button onClick={() => {
        const textToCopy = `<iframe src="https://${window.location.hostname}/world/${companyToken}/${record.id}.splat" title="${record.title}" style="width:100%; height:100dvh; border:none;"></iframe>`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          message.success('Copied to Clipboard');
        }).catch(err => {
          message.error('Could not copy text: ', err);
        });
      }}>Copy Embeded Script</Button>
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
    try {
      setLoading(true);
      const splatFile = await http.fileUploader(values.file.file)
      const thumbnailFile = await http.fileUploader(values.thumbnail.file)
      const response = await http.editSplat({
        storage_id: splatFile.responseObject.id,
        title: values.title,
        description: values.description,
        thumbnail_id: thumbnailFile.responseObject.id,
        company_id: companyId
      });
      message.success('File Registered successfully');
      handleRefetch();
      setEditingFile(null);

    } catch (error) {
      message.error('File Register failed');
    } finally {
      setLoading(false);
    }
  };

  const loadCompany = async () => {
    setLoading(true);
    try {
      const response = await http.listCompanies(params);
      setListCompany(response.responseObject);
      console.log(handleRefetch);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const loadList = async (body: any) => {
    setCompanyId(body?.company_id)
    setCompanyToken(body?.company_token)
    setLoading(true);
    try {
      const response = await http.listSplat({...params, ...body});
      setListSplat(response.responseObject);
      console.log(handleRefetch);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
    loadList(companyData)
  }, [refetch]);
  useEffect(() => {
    if (editingFile) {
      editForm.setFieldsValue({
        title: editingFile.title,
        description: editingFile.description,
      });
    }
  }, [editingFile]);


  return (
      <>
        <Select
            style={{marginBottom: 16}}
            onChange={(e) => {
              setCompanyData({company_id: e, company_token: listCompany?.find((data: any) => data.id === e)?.token})
              loadList({company_id: e, company_token: listCompany?.find((data: any) => data.id === e)?.token})
            }}
            placeholder={"Select Company"}
            options={listCompany?.map((item: any) => {
              return {label: item.name, value: item.id}
            })}
        />
    <Card
      title="Manage Splat"
      extra={
        <>
          {!!companyId &&
              <Button type="primary" onClick={() => {
                form.resetFields()
                setShowModal(true)
              }}>
                Add Splat
              </Button>
          }
        </>
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
        <Form form={form} onFinish={handleCreate}>
          <Form.Item
            name="file"
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
          >
            <Dragger {...propsThumbnail}>
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
              name="description"
            rules={[
              {required: true, message: 'Please input the description!'},
            ]}
          >
            <Input.TextArea placeholder="Description"/>
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
              name="description"
            rules={[
              {required: true, message: 'Please input the description!'},
            ]}
          >
            <Input.TextArea placeholder="Description"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
      </>
  );
};

export default Splat;
