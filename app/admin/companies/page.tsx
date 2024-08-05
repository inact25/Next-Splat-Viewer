import React from 'react';
import {Col, Result, Row} from "antd";
import {API_URL} from "@/app/constant/config";
import dynamic from "next/dynamic";
import {LoadingOutlined} from "@ant-design/icons";
import Companies from "@/app/components/Admin/Manage/companies";


const LayoutAuth = dynamic(
    () => import('@/app/components/LayoutAntd/LayoutAuth'),
    {
        ssr: false,
        loading: () => (
            <Result
                title="Loading"
                subTitle="Please wait while we load the page."
                icon={<LoadingOutlined style={{fontSize: 24}} spin/>}
            />
        ),
    },
);

const Page = () => {
    return (
        <LayoutAuth>
            <Row gutter={[10, 10]}>
                <Col xs={24}>
                    <Companies url={API_URL}/>
                </Col>
            </Row>
        </LayoutAuth>
    );
};

export default Page;
