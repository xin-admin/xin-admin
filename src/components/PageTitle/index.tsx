import {type JSX, useEffect} from "react";
import {useGlobalStore} from "@/stores";

const PageTitle = (props: {children: JSX.Element}) => {
  const headTitle = useGlobalStore(state => state.headTitle);

  useEffect(() => {
    document.title = headTitle
  }, [headTitle]);

  const { children } = props;
  return children;
}

export default PageTitle;