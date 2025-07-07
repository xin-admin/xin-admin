import {Outlet, useNavigate} from "react-router";
import {Card, Button, Segmented, Row, Col} from 'antd';
import {useState} from "react";

const Info = () => {
    const navigate = useNavigate();
    const [alignValue, setAlignValue] = useState('/user/info');

    return (
        <div>
            <Card variant={'borderless'} style={{overflow: "hidden", marginBottom: 20}} styles={{ body: {padding: 0, height: '200px' }}}>
                <div
                    className="flex justify-between p-4 h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%), url(/public/user/header-2d36b370.jpg)`
                    }}
                >
                    <div className="w-[50%] relative">
                        <span className="w-14 h-14 absolute bottom-2 left-2 bg-white rounded-full p-1">
                            <img src="/public/favicons.svg" alt="avatar" />
                        </span>
                        <span className="absolute bottom-8 left-20 font-bold text-white text-2xl">XinAdmin</span>
                        <span className="absolute bottom-2 left-20 text-white">山高路远，看世界也找自己 --- 小刘同学</span>
                    </div>
                    <div className="relative">
                        <Button className="absolute bottom-2.5 right-2.5">编辑资料</Button>
                    </div>
                </div>
            </Card>
            <Row gutter={20}>
                <Col span={16}>
                    <Card variant={'borderless'} styles={{body: {padding: "5px"}}} style={{marginBottom: 10}}>
                        <Segmented
                            size={'middle'}
                            value={alignValue}
                            onChange={(value) => {
                                setAlignValue(value)
                                navigate(value);
                            }}
                            options={[
                                {
                                    label: "我的文章",
                                    value: '/user/info'
                                },
                                {
                                    label: "最新动态",
                                    value: '/user/info/condition'
                                },
                                {
                                    label: "站内通知",
                                    value: '/user/info/notice'
                                },
                            ]}
                        />
                    </Card>
                    <Card variant={"borderless"}>
                        <Outlet />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card variant={'borderless'}></Card>
                </Col>
            </Row>
        </div>
    );
};

export default Info;