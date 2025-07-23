import ReactDOM from "react-dom/client";
import App from "./App";
import '@ant-design/v5-patch-for-react-19';
import './index.css';
import '@/locales/i18n.ts';

const root = document.getElementById("root");

// 配置请求拦截，确保只在生产环境中使用
// Configure request interception to ensure it is only used in the production environment
async function prepareApp() {
  // if (
  //   process.env.NODE_ENV === 'development' ||
  //   process.env.NODE_ENV === 'test'
  // ) {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass'
    })
  // }
  // return Promise.resolve()
}

prepareApp().then(() => {
  ReactDOM.createRoot(root!).render(<App/>);
})

