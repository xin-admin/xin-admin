import menu from './menu';
import userSetting from "./user-setting";
import xinTable from "./xin-table.ts";

export default {
  ...xinTable,
  ...menu,
  ...userSetting
};