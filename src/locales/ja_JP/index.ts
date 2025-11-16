import menu from './menu';
import userSetting from "./user-setting";
import xinTable from "./xin-table";
import sysUserList from "./sys-user-list";
import sysUserDept from "./sys-user-dept";
import sysUserRule from "./sys-user-rule";
import sysUserRole from "./sys-user-role";
import watcher from "./watcher";
import sysFile from "./sys-file";

export default {
  ...xinTable,
  ...menu,
  ...userSetting,
  ...sysUserList,
  ...sysUserDept,
  ...sysUserRule,
  ...sysUserRole,
  ...watcher,
  ...sysFile,
};