import type { ISysFileGroup } from "@/domain/iSysFileGroup";
import createAxios from "@/utils/request";

// 文件夹相关API
export function getFileGroupList() {
  return createAxios<ISysFileGroup[]>({
    url: '/sys/file/group',
    method: 'get',
  });
}

export function createFileGroup(params: ISysFileGroup) {
  return createAxios({
    url: '/sys/file/group',
    method: 'post',
    data: params,
  });
}

export function updateFileGroup(params: ISysFileGroup) {
  return createAxios({
    url: `/sys/file/group/${params.id}`,
    method: 'put',
    data: params,
  });
}

export function deleteFileGroup(id: number) {
  return createAxios<boolean>({
    url: `/sys/file/group/${id}`,
    method: 'delete',
  });
}
