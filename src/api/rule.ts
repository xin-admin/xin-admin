import createAxios from "@/utils/request.ts";

export interface ParentNodeType {
  label: string;
  value: string;
  children?: ParentNodeType[];
}

export function selectParentNode() {
  return createAxios<ParentNodeType[]>({
    url: '/system/rule/parent',
    method: 'get',
  });
}