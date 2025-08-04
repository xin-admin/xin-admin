import {http, HttpResponse, type HttpResponseResolver} from "msw";
import {withAuth} from '@/mocks/middleware';
import type {IRule} from "@/domain/iRule.ts";
import defaultRoute from "@/router/default";
import type {ParentNodeType} from "@/api/rule.ts";

const selectRulesParent: HttpResponseResolver = async () => {
  function convertRulesToTree(rules: IRule[]): ParentNodeType[] {
    const filteredRules = rules.filter(rule => rule.type !== 'rule');
    const nodeMap: Record<number, ParentNodeType> = {};
    const result: ParentNodeType[] = [];
    filteredRules.forEach(rule => {
      nodeMap[rule.id] = {
        label: rule.name || '',
        value: String(rule.id)
      };
    });
    filteredRules.forEach(rule => {
      const currentNode = nodeMap[rule.id];
      const parentId = rule.pid;
      if (parentId === 0) {
        result.push(currentNode);
      } else if (nodeMap[parentId]) {
        if (!nodeMap[parentId].children) {
          nodeMap[parentId].children = [];
        }
        nodeMap[parentId].children!.push(currentNode);
      }
    });
    const removeEmptyChildren = (nodes: ParentNodeType[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length === 0) {
          delete node.children;
        } else if (node.children) {
          removeEmptyChildren(node.children);
        }
      });
    };
    removeEmptyChildren(result);
    return result;
  }

  return HttpResponse.json<API.ResponseStructure<ParentNodeType[]>>({
    success: true,
    msg: "成功",
    data: convertRulesToTree(defaultRoute)
  })
}

type RulesTree = IRule & { children?: IRule[], created_at?: string, updated_at?: string };

const selectRules: HttpResponseResolver = async () => {
  function convertRulesToTree(rules: IRule[]){
    const nodeMap: Record<number, RulesTree> = {};
    const result: RulesTree[] = [];
    rules.forEach(rule => {
      nodeMap[rule.id] = {
        ...rule,
        created_at: '2025-11-11',
        updated_at: '2025-11-11',
      };
    });
    rules.forEach(rule => {
      const currentNode = nodeMap[rule.id];
      const parentId = rule.pid;

      if (parentId === 0) {
        // 根节点，直接添加到结果中
        result.push(currentNode);
      } else if (nodeMap[parentId]) {
        // 有父节点，添加到父节点的 children 中
        if (!nodeMap[parentId].children) {
          nodeMap[parentId].children = [];
        }
        nodeMap[parentId].children!.push(currentNode);
      }
    });
    const removeEmptyChildren = (nodes: RulesTree[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length === 0) {
          delete node.children;
        } else if (node.children) {
          removeEmptyChildren(node.children);
        }
      });
    };
    removeEmptyChildren(result);
    return result;
  }

  return HttpResponse.json<API.ResponseStructure<API.ListResponse<RulesTree>>>({
    success: true,
    msg: "成功",
    data: {
      data: convertRulesToTree(defaultRoute),
      page: 1,
      total: 100,
      per_page: 1,
      current_page: 1,
    }
  })
}

// The root-level request handlers combine
// all the domain-based handlers into a single
// network description array.
export const rules = [
  http.get('/api/system/rule/parent', withAuth(selectRulesParent)),
  http.get('/api/system/rule', withAuth(selectRules)),
]