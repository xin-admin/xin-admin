import { type ReactNode, useEffect, useRef } from "react";
import { useGlobalStore } from "@/stores";

interface PageTitleProps {
  children: ReactNode;
}

/**
 * 页面标题组件
 * 职责：监听 documentTitle 状态变化，负责实际的 document.title 更新
 * 标题格式化由 usePageTitle Hook 负责
 */
const PageTitle = ({ children }: PageTitleProps) => {
  const documentTitle = useGlobalStore(state => state.documentTitle);
  const defaultSiteName = useGlobalStore(state => state.title);
  const lastTitleRef = useRef<string>("");

  useEffect(() => {
    // 使用已格式化的标题，或回退到默认站点名
    const title = documentTitle || defaultSiteName || "Xin Admin";

    // 性能优化: 避免设置相同的标题
    if (lastTitleRef.current !== title) {
      document.title = title;
      lastTitleRef.current = title;
    }
  }, [documentTitle, defaultSiteName]);

  return <>{children}</>;
}

export default PageTitle;