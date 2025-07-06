import {Outlet, useNavigate} from "react-router";
import {Card, Button} from 'antd';
import {useEffect, useState} from "react";

const headerImageList = [
    '/public/user/header-6fb871f1.jpg',
    '/public/user/header-fc888f18.jpg',
    '/public/user/header-2d36b370.jpg',
]

const Info = () => {
    const navigate = useNavigate();
    const [headerImage, setHeaderImage] = useState<string>('/public/user/header-6fb871f1.jpg')

    useEffect(() => {
        let i = 0
        // setInterval(() => {
        //     if(i < headerImageList.length) {
        //         setHeaderImage(headerImageList[i])
        //         i++;
        //     }else {
        //         setHeaderImage(headerImageList[0])
        //         i = 0;
        //     }
        // },2000)
    })

    return (
        <div>
            <Card variant={'borderless'} style={{overflow: "hidden"}} styles={{ body: {padding: 0, height: '200px' }}}>
                <div
                    className="flex justify-between p-4 h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%), url(${headerImage})`
                    }}
                >
                    <div className="w-[50%] relative">
                        <img src="/public/favicons.svg" alt="avatar" className="w-14 h-14 absolute bottom-2 left-2"/>
                        <span className="absolute bottom-8 left-20 font-bold text-white text-2xl">XinAdmin</span>
                        <span className="absolute bottom-2 left-20 text-white">山高路远，看世界也找自己 --- 小刘同学</span>
                    </div>
                    <div className="relative">
                        <Button className="absolute bottom-2.5 right-2.5">编辑资料</Button>
                    </div>
                </div>
            </Card>
            <a onClick={() => navigate('/user/info')}>姓名</a>
            <a onClick={() => navigate('/user/info/avatar')}>头像</a>

            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Info;