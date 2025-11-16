import createAxios from "@/utils/request";
import type { ISysFileInfo, SysFileType } from "@/domain/iSysFile";

export type FileListParams = {
  group_id?: number;
  name?: string;
  file_type?: SysFileType;
  page?: number;
  pageSize?: number;
}

const fileUrlMap = {
  10: '/sys/file/list/upload/image',
  20: '/sys/file/list/upload/audio',
  30: '/sys/file/list/upload/video',
  40: '/sys/file/list/upload/zip',
  50: '/sys/file/list/upload/file',
}

// 文件相关API
export function getFileList(params: FileListParams) {
  return createAxios<API.ListResponse<ISysFileInfo>>({
    url: '/sys/file/list',
    method: 'get',
    params,
  });
}

export function uploadFile(file: File, fileType: SysFileType, groupId?: number, onProgress?: (progress: number) => void) {
  const formData = new FormData();
  formData.append('file', file);
  if (groupId) {
    formData.append('group_id', groupId.toString());
  }
  return createAxios({
    timeout: 0,
    url: fileUrlMap[fileType],
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
}

export function deleteFile(id: string) {
  return createAxios<boolean>({
    url: `/sys/file/list/${id}`,
    method: 'delete',
  });
}

export function forceDeleteFile(id: string) {
  return createAxios<boolean>({
    url: `/sys/file/list/force-delete/${id}`,
    method: 'delete',
  });
}