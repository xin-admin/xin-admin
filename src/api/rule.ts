import {request} from "@/utils/request.ts";

export interface ParentNodeType {
  label: string;
  value: string;
  children?: ParentNodeType[];
}

export async function selectParentNode() {
  return request.post<API.ResponseStructure<ParentNodeType[]>>('/system/rule/parent');
}