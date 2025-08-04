import {type JSX, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useGlobalStore} from "@/stores";
import useAuthStore from "@/stores/user";

const PageTitle = (props: {children: JSX.Element}) => {
  const { t } = useTranslation();
  const menuSelectedKeys = useGlobalStore(state => state.menuSelectedKeys);
  const rules = useAuthStore(state => state.rules);
  const title = useGlobalStore(state => state.title);

  useEffect(() => {
    const rule = rules.find(rule => rule.key === menuSelectedKeys[0]);
    if(rule && rule.local) {
      document.title = t(rule.local) + ' - ' + title;
    }else {
      document.title = title
    }
  }, [menuSelectedKeys, rules, t, title]);

  const { children } = props;
  return children;
}

export default PageTitle;