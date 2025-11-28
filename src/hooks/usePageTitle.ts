import { useGlobalStore } from "@/stores";
import { useCallback } from "react";

interface SetPageTitleOptions {
  /** 是否附带站点名称 */
  withSite?: boolean;
  /** 分隔符 */
  separator?: string;
  /** 格式化方式 */
  format?: 'prefix' | 'suffix' | 'only';
}

/**
 * 页面标题管理 Hook
 */
export const usePageTitle = () => {
  const title = useGlobalStore(state => state.title);
  const setDocumentTitle = useGlobalStore(state => state.setDocumentTitle);

  /**
   * 设置页面标题
   * @param pageTitle - 页面标题
   * @param options - 格式化选项
   */
  const setPageTitle = useCallback((pageTitle: string, options?: SetPageTitleOptions) => {
    const { 
      withSite = true, 
      separator = ' - ', 
      format = 'suffix' 
    } = options || {};

    let finalTitle: string;

    if (!withSite || format === 'only') {
      finalTitle = pageTitle;
    } else if (format === 'prefix') {
      finalTitle = `${title}${separator}${pageTitle}`;
    } else {
      finalTitle = `${pageTitle}${separator}${title}`;
    }

    // 更新到全局状态，由 PageTitle 组件负责实际的 DOM 更新
    setDocumentTitle(finalTitle);
  }, [title, setDocumentTitle]);

  return { setPageTitle };
};
