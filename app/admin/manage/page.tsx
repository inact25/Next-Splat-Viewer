import dynamic from 'next/dynamic';
import { Col, Result, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Splat from '@/app/components/Admin/Manage/splat';
import { API_URL } from '@/app/constant/config';

const LayoutAuth = dynamic(
  () => import('@/app/components/LayoutAntd/LayoutAuth'),
  {
    ssr: false,
    loading: () => (
      <Result
        title="Loading"
        subTitle="Please wait while we load the page."
        icon={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    ),
  },
);
const Page = (props: any) => {
  return (
    <LayoutAuth>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <Splat url={API_URL} />
        </Col>
      </Row>
    </LayoutAuth>
  );
};

export default Page;
