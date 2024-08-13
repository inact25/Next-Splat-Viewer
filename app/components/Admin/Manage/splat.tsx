'use client';

import httpClient from '@/app/actions/httpClient';
import { ListFilesResponse } from '@/app/actions/http';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Upload,
  UploadProps,
} from 'antd';
import { CloudUploadOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';
import GaussianSplat from '@/app/components/GaussianSplat';

const { Dragger } = Upload;
const Splat = ({ url }: any) => {
  const [recordData, setRecordData] = useState<any>({});
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [companyId, setCompanyId] = useState(0);
  const [companyToken, setCompanyToken] = useState(0);
  const [companyData, setCompanyData] = useState<any>({});
  const [editingFile, setEditingFile] = useState<ListFilesResponse | null>(
    null,
  );
  const [isAnimate, setIsAnimate] = useState(true);
  const [params, setParams] = useState({ limit: 10, page: 1, company_id: 0 });

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const fileSizeMB = file.size / 1000000; // Convert bytes to MB
      if (fileSizeMB > 150) {
        message.error('File size exceeds 150MB');
        return Upload.LIST_IGNORE; // Prevent upload and remove the file from the list
      }
      form.setFieldsValue({ file: file });
      return false; // Prevent default upload behavior
    },

    accept: '.splat',
  };

  const propsThumbnail: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const fileSizeMB = file.size / 1000000; // Convert bytes to MB
      if (fileSizeMB > 10) {
        message.error('File size exceeds 150MB');
        return Upload.LIST_IGNORE; // Prevent upload and remove the file from the list
      }
      form.setFieldsValue({ thumbnail: file });
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
      const splatFile = await http.fileUploader(values.file.file);
      const thumbnailFile = values?.thumbnail?.file
        ? await http.fileUploader(values.thumbnail.file)
        : { responseObject: { id: null } };
      await http.createSplat({
        storage_id: splatFile.responseObject.id,
        title: values.title,
        description: values.description,
        thumbnail_id: thumbnailFile?.responseObject?.id ?? null,
        company_id: Number(companyId),
        is_animated: values.is_animated,
      });
      message.success('File Registered successfully');
      handleRefetch();
      setShowModal(false);
    } catch (error) {
      console.log(error);
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
  const [splatData, setSplatData] = useState<any>();
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
      render: (text: any) => {
        text = text === '' ? null : text;
        return (
          <img
            src={text ?? '/greenview.jpeg'}
            alt={text}
            style={{
              width: 50,
              height: 50,
              objectFit: 'cover',
              borderRadius: '10rem',
            }}
          />
        );
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
      title: 'Splat Model',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string, record: any) => (
        <Button
          onClick={() => {
            setRecordData(record);
          }}
        >
          Generate Script
        </Button>
      ),
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

  const getData = async (slug: string) => {
    const res = await axios.get(`${url}/bridge/slug/${slug}`);
    setIsAnimate(res.data.responseObject?.splat?.is_animated);
    setSplatData(res.data.responseObject);
  };

  useEffect(() => {
    if (recordData.slug) {
      getData(recordData.slug);
    }
  }, [recordData.slug, isAnimate]);

  const handleEdit = async (values: any) => {
    let payload: any = {
      id: editingFile?.id,
      title: values.title,
      description: values.description,
      is_animated: values.is_animated,
      company_id: Number(companyId),
    };

    if (values.file) {
      const splatFile = await http.fileUploader(values.file.file);
      payload.storage_id = Number(splatFile.responseObject.id);
    } else {
      payload.storage_id = editingFile?.storage_id ? Number(editingFile?.storage_id) : editingFile?.storage_id;
    }

    if (values.thumbnail) {
      const thumbnailFile = await http.fileUploader(values.thumbnail.file);
      payload.thumbnail_id = thumbnailFile.responseObject.id
        ? Number(thumbnailFile.responseObject.id)
        : thumbnailFile.responseObject.id
    } else {
      payload.thumbnail_id = editingFile?.thumbnail_id ? Number(editingFile?.thumbnail_id) : editingFile?.thumbnail_id;
    }

    try {
      setLoading(true);
      const response = await http.editSplat(payload);
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const loadList = async (body: any) => {
    setCompanyId(body?.company_id);
    setCompanyToken(body?.company_token);
    setLoading(true);
    try {
      const response = await http.listSplat({ ...params, ...body });
      setListSplat(response.responseObject);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
    loadList(companyData);
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
        style={{ marginBottom: 16 }}
        onChange={(e) => {
          setCompanyData({
            company_id: e,
            company_token: listCompany?.find((data: any) => data.id === e)
              ?.token,
            company_name: listCompany
              ?.find((data: any) => data.id === e)
              ?.name?.replaceAll(' ', '_'),
          });
          loadList({
            company_id: e,
            company_token: listCompany?.find((data: any) => data.id === e)
              ?.token,
          });
        }}
        placeholder={'Select Company'}
        options={listCompany
          ?.filter((item) => item.token)
          ?.map((item) => ({ label: item.name, value: item.id }))}
      />
      <Card
        title="Manage Splat"
        extra={
          <>
            {!!companyId && (
              <Button
                type="primary"
                onClick={() => {
                  form.resetFields();
                  setShowModal(true);
                }}
              >
                Add Splat
              </Button>
            )}
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
          <Form
            form={form}
            initialValues={{ is_animated: true }}
            onFinish={handleCreate}
            layout="vertical"
          >
            <Form.Item style={{ fontWeight: 500 }} name="file" label="Upload Gausian Splat File">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Accept only .splat file and file size must be smaller than
                  150MB
                </p>
              </Dragger>
            </Form.Item>
            <hr style={{ marginBottom: '1rem' }} />
            <div className="font-medium mb-4">Upload Thumbnail and Fill the Data</div>

            <Row gutter={[16, 16]}>
              <Col lg={8}>
                <Form.Item name="thumbnail">
                  <Dragger {...propsThumbnail}>
                    <p className="ant-upload-drag-icon">
                      <CloudUploadOutlined />
                    </p>
                    <p className="ant-upload-text !text-[10px]">
                      Click or drag thumbnail to this area to upload
                    </p>
                    <p className="ant-upload-hint !text-[10px]">
                      Accept only image files and file size must be smaller than
                      10MB
                    </p>
                  </Dragger>
                </Form.Item>
              </Col>
              <Col lg={16}>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: 'Please input the title!' }]}
                >
                  <Input placeholder="Title" />
                </Form.Item>
                <Form.Item
                  name="description"
                  rules={[
                    { required: true, message: 'Please input the description!' },
                  ]}
                >
                  <Input.TextArea placeholder="Description" />
                </Form.Item>
                <Form.Item

                  valuePropName={'checked'}
                  style={{ fontWeight: 'bold', fontSize: 18, marginTop: -12 }}
                  label={'Enable Animation'}
                  name={'is_animated'}
                  rules={[
                    { required: true, message: 'Please set Animation Status!' },
                  ]}
                >
                  <Switch
                    style={{ marginTop: -10 }}
                    checkedChildren="Enable"
                    unCheckedChildren="Disable"
                    defaultChecked
                    defaultValue={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
              <Col>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Upload
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="Edit Splat"
          open={!!editingFile}
          onCancel={() => setEditingFile(null)}
          footer={null}
        >
          <Form
            form={editForm}
            initialValues={{ is_animated: true }}
            onFinish={handleEdit}
            layout="vertical"
          >
            <Form.Item style={{ fontWeight: 500 }} name="file" label="Upload Gausian Splat File">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Accept only .splat file and file size must be smaller than
                  150MB
                </p>
              </Dragger>
            </Form.Item>
            <hr style={{ marginBottom: '1rem' }} />
            <div className="font-medium mb-4">Upload Thumbnail and Fill the Data</div>
            <Row gutter={[16, 16]}>
              <Col lg={8}>
                <Form.Item name="thumbnail">
                  <Dragger {...propsThumbnail}>
                    {editingFile?.thumbnail_url ? (
                      <img
                        src={editingFile?.thumbnail_url}
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          maxHeight: 150,
                        }}
                      />
                    ) : (
                      <>
                        <p className="ant-upload-drag-icon">
                          <CloudUploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag thumbnail to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                          Accept only image files and file size must be smaller
                          than 10MB
                        </p>
                      </>
                    )}
                  </Dragger>
                </Form.Item>
                <Form.Item>
                  {editingFile?.thumbnail_id && (
                    <Button
                      type={'primary'}
                      danger
                      style={{ bottom: 58, left: 3, position: 'absolute' }}
                      onClick={() => {
                        const dataField = { ...editingFile };
                        dataField.thumbnail_id = null;
                        // @ts-ignore
                        dataField.thumbnail_url = null;
                        setEditingFile(dataField);
                      }}
                    >
                      Delete Thumbnail
                    </Button>
                  )}
                </Form.Item>
              </Col>
              <Col lg={16}>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: 'Please input the title!' }]}
                >
                  <Input placeholder="Title" />
                </Form.Item>
                <Form.Item
                  name="description"
                  rules={[
                    { required: true, message: 'Please input the description!' },
                  ]}
                >
                  <Input.TextArea placeholder="Description" />
                </Form.Item>
                <Form.Item
                  valuePropName={'checked'}
                  style={{ fontWeight: 'bold', fontSize: 18, marginTop: -16 }}
                  label={'Enable Animation'}
                  name={'is_animated'}
                  rules={[
                    { required: true, message: 'Please set Animation Status!' },
                  ]}
                >
                  <Switch
                    style={{ marginTop: -10 }}
                    checkedChildren="Enable"
                    unCheckedChildren="Disable"
                    defaultChecked
                    defaultValue={true}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
        <>
          <Modal
            title="Generate World Script"
            open={!!Object.keys(recordData)?.length}
            onOk={() => setRecordData({})}
            onCancel={() => setRecordData({})}
          >
            <div
              style={{ marginBottom: '2rem', height: 300 }}
              className="preview relative"
            >
              {splatData && Object.keys(splatData) ? (
                <>
                  <GaussianSplat
                    src={splatData?.splat?.storage_url}
                    isAnimate={isAnimate}
                    thumbnail={''}
                    className={
                      '!h-[300px] !min-h-[300px] !max-h-[300px] border'
                    }
                  />
                  <div className="mt-[-3rem] mb-10">
                    <div className="flex justify-between items-center px-4">
                      <div>
                        <div className="flex gap-2 items-center">
                          <div>
                            <Button
                              className={`${isAnimate ? '!bg-green-900 !text-white' : '!bg-white text-green-900'} font-bold `}
                              onClick={() => {
                                setIsAnimate(true);
                                setSplatData(null);
                              }}
                            >
                              Static
                            </Button>
                          </div>
                          <div>
                            <Button
                              className={`${!isAnimate ? '!bg-green-900 !text-white' : '!bg-white text-green-900'} font-bold `}
                              onClick={() => {
                                setIsAnimate(false);
                                setSplatData(null);
                              }}
                            >
                              Animate
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={() =>
                            window.open(
                              `https://${window.location.hostname}/s/${recordData.slug}`,
                              '_blank',
                            )
                          }
                        >
                          Full Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  Downloading Splat file...
                </div>
              )}
            </div>
            <h5 style={{ fontWeight: 600, marginBottom: '.5rem' }}>
              Private Url
            </h5>
            <div
              style={{
                marginBottom: '2rem',
                display: 'flex',
                gap: 5,
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Input
                  width={'100%'}
                  disabled
                  value={`https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}`}
                />
              </div>
              <div style={{ width: 'auto' }}>
                <Button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        `https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}`,
                      )
                      .then(() => {
                        message.success('Copied to Clipboard');
                      })
                      .catch((err) => {
                        message.error('Could not copy text: ', err);
                      });
                  }}
                >
                  Copy Url
                </Button>
              </div>
            </div>
            <h5 style={{ fontWeight: 600, marginBottom: '.5rem' }}>
              Public Url
            </h5>
            <div
              style={{
                marginBottom: '2rem',
                display: 'flex',
                gap: 5,
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Input
                  disabled
                  value={`https://${window.location.hostname}/s/${recordData.slug}`}
                />
              </div>
              <div style={{ width: 'auto' }}>
                <Button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        `https://${window.location.hostname}/s/${recordData.slug}`,
                      )
                      .then(() => {
                        message.success('Copied to Clipboard');
                      })
                      .catch((err) => {
                        message.error('Could not copy text: ', err);
                      });
                  }}
                >
                  Copy Url
                </Button>
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <h5 style={{ fontWeight: 600, marginBottom: '.5rem' }}>Script</h5>
              <div
                style={{
                  marginBottom: '2rem',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Input.TextArea
                    style={{ marginBottom: '1rem' }}
                    rows={3}
                    disabled
                    value={`<iframe src="https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}" title="${recordData.title}" style="width:100%; height:100dvh; border:none;"></iframe>`}
                  />
                </div>
                <div>
                  <Button
                    onClick={() => {
                      const textToCopy = `<iframe src="https://${window.location.hostname}/${companyData?.company_name}/${companyToken}/${recordData.id}" title="${recordData.title}" style="width:100%; height:100dvh; border:none;"></iframe>`;
                      navigator.clipboard
                        .writeText(textToCopy)
                        .then(() => {
                          message.success('Script Copied to Clipboard');
                        })
                        .catch((err) => {
                          message.error('Could not copy Script: ', err);
                        });
                    }}
                  >
                    Copy Script
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </>
      </Card>
    </>
  );
};

export default Splat;
