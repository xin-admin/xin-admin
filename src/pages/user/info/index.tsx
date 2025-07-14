import {Outlet, useNavigate} from "react-router";
import {Button, Card, Col, Row} from 'antd';
import useAuthStore from "@/stores/user.ts";

const Info = () => {
  const navigate = useNavigate();
  const userInfo = useAuthStore(state => state.user);

  if (!userInfo) {
    return <></>;
  }

  return (
    <div>
      <Card variant={'borderless'} style={{overflow: "hidden", marginBottom: 20}}
            styles={{body: {padding: 0, height: '200px'}}}>
        <div
          className="flex justify-between p-4 h-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%), url(/public/user/header-2d36b370.jpg)`
          }}
        >
          <div className="w-[50%] relative">
                        <span className="w-14 h-14 absolute bottom-2 left-2 bg-white rounded-full p-2 overflow-hidden">
                            <img src={userInfo.avatar_url} alt="avatar"/>
                        </span>
            <span className="absolute bottom-8 left-20 font-bold text-white text-2xl">{userInfo.nickname}</span>
            <span className="absolute bottom-2 left-20 text-white">山高路远，看世界也找自己 --- 小刘同学</span>
          </div>
          <div className="relative">
            <Button className="absolute bottom-2.5 right-2.5">编辑资料</Button>
          </div>
        </div>
      </Card>
      <Row gutter={20}>
        <Col span={16}>
          <Card
            tabProps={{type: 'line'}}
            onTabChange={key => navigate(key)}
            tabList={[
              {
                label: `我的文章`,
                key: '/user/info',
              },
              {
                label: "最新动态",
                key: '/user/info/condition'
              },
              {
                label: "站内通知",
                key: '/user/info/notice'
              },
            ]}
          >
            <Outlet/>
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