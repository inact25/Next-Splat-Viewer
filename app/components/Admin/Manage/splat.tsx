'use client';

import httpClient from '@/app/actions/httpClient';
import { ListFilesResponse } from '@/app/actions/http';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Modal, Select, Space, Switch, Table, Upload, UploadProps } from 'antd';
import { CloudUploadOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';

const { Dragger } = Upload;
const Splat = ({url}: any) => {
  const [recordData, setRecordData] = useState<any>({});
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [companyId, setCompanyId] = useState(0)
  const [companyToken, setCompanyToken] = useState(0)
  const [companyData, setCompanyData] = useState<any>({});
  const [editingFile, setEditingFile] = useState<ListFilesResponse | null>(
    null,
  );
  const [params, setParams] = useState({limit: 10, page: 1, company_id: 0})

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const fileSizeMB = file.size / 1000000; // Convert bytes to MB
      if (fileSizeMB > 150) {
        message.error('File size exceeds 150MB');
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
      if (fileSizeMB > 150) {
        message.error('File size exceeds 150MB');
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
        company_id: Number(companyId),
        is_animated: values.is_animated,
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
      title: 'Script',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string, record:any) => <Button onClick={() => {
        setRecordData(record);
      }}>Generate Script</Button>
    },
    // {
    //   title: 'Embed Url',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   render: (text: string, record:any) => <Button onClick={() => {
    //     navigator.clipboard.writeText(`https://${window.location.hostname}/world/${companyData?.company_name}/${companyToken}/${record.id}.splat`).then(() => {
    //       message.success('Copied to Clipboard');
    //     }).catch(err => {
    //       message.error('Could not copy text: ', err);
    //     });
    //   }}>Copy Embeded Url</Button>
    // },
    // {
    //   title: 'Embed Script',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   render: (text: string, record:any) => <Button onClick={() => {
    //     const textToCopy = `<iframe src="https://${window.location.hostname}/world/${companyData?.company_name}/${companyToken}/${record.id}.splat" title="${record.title}" style="width:100%; height:100dvh; border:none;"></iframe>`;
    //     navigator.clipboard.writeText(textToCopy).then(() => {
    //       message.success('Copied to Clipboard');
    //     }).catch(err => {
    //       message.error('Could not copy text: ', err);
    //     });
    //   }}>Copy Embeded Script</Button>
    // },
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
        id: editingFile?.id,
        storage_id: splatFile.responseObject.id,
        title: values.title,
        description: values.description,
        thumbnail_id: thumbnailFile.responseObject.id,
        company_id: companyId,
        is_animated: values.is_animated
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
              setCompanyData({
                company_id: e,
                company_token: listCompany?.find((data: any) => data.id === e)?.token,
                company_name: listCompany?.find((data: any) => data.id === e)?.name?.replaceAll(' ', '_'),
              });
              loadList({company_id: e, company_token: listCompany?.find((data: any) => data.id === e)?.token})
            }}
            placeholder={"Select Company"}
            options={listCompany?.filter(item => item.token)?.map(item => ({ label: item.name, value: item.id }))}
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
        <Form form={form} initialValues={{ is_animated: true }} onFinish={handleCreate}>
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
                Accept only .splat file and file size must be smaller than 150MB
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
                Accept only image files and file size must be smaller than 150MB
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
          <Form.Item
            valuePropName={'checked'}
            style={{ fontWeight: 'bold', fontSize: 18 }}
            label={'Enable Animation'}
            name={'is_animated'}
            rules={[{ required: true, message: 'Please set Animation Status!' }]}
          >
            <Switch
              checkedChildren="Enable"
              unCheckedChildren="Disable"
              defaultChecked
              defaultValue={true}
            />
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
        <Form form={editForm} initialValues={{ is_animated: true }} onFinish={handleEdit}>
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
                Accept only .splat file and file size must be smaller than 150MB
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
                Accept only image files and file size must be smaller than 150MB
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
          <Form.Item
            valuePropName={'checked'}
            style={{ fontWeight: 'bold', fontSize: 18 }}
            label={'Enable Animation'}
            name={'is_animated'}
            rules={[{ required: true, message: 'Please set Animation Status!' }]}
          >
            <Switch
              checkedChildren="Enable"
              unCheckedChildren="Disable"
              defaultChecked
              defaultValue={true}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <>
        <Modal title="Generate World Script" open={!!Object.keys(recordData)?.length} onOk={() => setRecordData({})}
               onCancel={() => setRecordData({})}>
          <div style={{ marginBottom: '2rem' }} className="preview">
            <iframe
              src={`https://${window.location.hostname}/s/${recordData.slug}.splat`}
              title="${record.title}" style={{ width: '100%', height: 300, border: 'none' }}></iframe>
            <div className="text-center mt-[-3rem] mb-[3rem]"><Button
              onClick={() => window.open(`https://${window.location.hostname}/s/${recordData.slug}.splat`, '_blank')}>Full
              Preview</Button></div>
          </div>
          <h5 style={{ fontWeight: 600, marginBottom: '.5rem' }}>Private Url</h5>
          <div style={{ marginBottom: '2rem', display: 'flex', gap: 5, justifyContent: 'space-between' }}>
            <div style={{ width: '80%' }}>
              <Input disabled
                     value={`https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}.splat`} />
            </div>
            <div style={{ width: 'auto' }}>
              <Button onClick={() => {
                navigator.clipboard.writeText(`https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}.splat`).then(() => {
                  message.success('Copied to Clipboard');
                }).catch(err => {
                  message.error('Could not copy text: ', err);
                });
              }}>Copy Url</Button>
            </div>
          </div>
          <h5 style={{ fontWeight: 600, marginBottom: '.5rem' }}>Public Url</h5>
          <div style={{ marginBottom: '2rem', display: 'flex', gap: 5, justifyContent: 'space-between' }}>
            <div style={{ width: '80%' }}>
              <Input disabled
                     value={`https://${window.location.hostname}/s/${recordData.slug}`} />
            </div>
            <div style={{ width: 'auto' }}>
              <Button onClick={() => {
                navigator.clipboard.writeText(`https://${window.location.hostname}/s/${recordData.slug}`).then(() => {
                  message.success('Copied to Clipboard');
                }).catch(err => {
                  message.error('Could not copy text: ', err);
                });
              }}>Copy Url</Button>
            </div>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h5 style={{ fontWeight: 600, marginBottom: '.5rem' }}>Script</h5>
            <div style={{ marginBottom: '2rem', justifyContent: 'space-between' }}>
              <div>
                <Input.TextArea style={{ marginBottom: '1rem' }} rows={3} disabled
                                value={`<iframe src="https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}.splat" title="${recordData.title}" style="width:100%; height:100dvh; border:none;"></iframe>`} />
              </div>
              <div>
                <Button onClick={() => {
                  const textToCopy = `<iframe src="https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}.splat" title="${recordData.title}" style="width:100%; height:100dvh; border:none;"></iframe>`;
                  navigator.clipboard.writeText(textToCopy).then(() => {
                    message.success('Script Copied to Clipboard');
                  }).catch(err => {
                    message.error('Could not copy Script: ', err);
                  });
                }}>Copy Script</Button>
              </div>
            </div>
          </div>
        </Modal></>
    </Card>
      </>
  );
};

export default Splat;
