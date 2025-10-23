import menu from './menu';
import userSetting from "./user-setting";
import xinTable from "./xin-table";
import sysUserList from "./sys-user-list";

export default {
  ...xinTable,
  ...menu,
  ...userSetting,
  ...sysUserList
};