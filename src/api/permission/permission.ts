import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

/** 角色所分配菜单ID */
export const listMenuIdByRoleId = (id: number) => {
  return http.request<any>(
    "get",
    baseUrlApi(`/permission/getMenuIdList/${id}`)
  );
};

/** 为角色分配菜单 */
export const assignForRole = (data?: object) => {
  return http.request<any>("post", baseUrlApi("/permission/assignForRole"), {
    data
  });
};
// 获取用户所拥有的角色Id
export const getRoleIdsByUserId = (id: number) => {
  return http.request<any>("get", baseUrlApi(`/permission/getRoleIds/${id}`));
};
export const assignRoleForUser = (data?: object) => {
  return http.request<any>(
    "post",
    baseUrlApi("/permission/assignRoleForUser"),
    {
      data
    }
  );
};
