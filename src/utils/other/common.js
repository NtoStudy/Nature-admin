import router from '@/router'
import { rootRoute } from '@/router/routes/basic'
import permissionRoutes from '@/router/routes/permission'
import * as $is from '@/utils/helper/is'
import * as $tree from '@/utils/helper/tree'
import * as $array from '@/utils/helper/array'
import { cloneDeep } from 'lodash'

// 生成最终权限菜单树tree，以及动态添加路由
export const formatAndAddPermissionRoutes = (
  authList,
  updateAblePermissionRoutesFullTree,
  updateAblePermissionButtons
) => {
  // 动态注册权限路由
  const onlinePermissionList = []
  // 接口返回用户权限菜单与本地完整路由菜单匹配所得权限菜单
  const o2oMatchedPermissionRoutes = []
  $tree.treeFlat(onlinePermissionList, authList, 0, [], 'children')

  $tree.recursionMachine(permissionRoutes, (node) => {
    const index = $array.indexOfObjInObjArrByKey(
      node,
      onlinePermissionList,
      'name'
    )

    if (index !== -1) {
      const { id, pid, title, icon, type, sort } = onlinePermissionList[index]
      node.id = id
      node.pid = pid
      // 使用线上接口返回的菜单name作为title
      node.meta.title = title
      // 使用线上接口返回的菜单icon
      node.meta.icon = icon
      node.type = type
      node.sort = sort

      o2oMatchedPermissionRoutes.push(node)
    }
  })

  // 升序排序菜单
  o2oMatchedPermissionRoutes.sort((a, b) => {
    return a.sort - b.sort
  })
  $tree.recursionMachine(o2oMatchedPermissionRoutes, (node) => {
    if ($is.isArray(node.children)) {
      node.children.sort((a, b) => {
        return a.sort - b.sort
      })
    }
  })

  // 完整的可访问权限树，组装整颗可访问的权限菜单树
  let ablePermissionRoutesFullTree = []
  $tree.formateTree(
    ablePermissionRoutesFullTree,
    [
      {
        id: 0,
        pid: '#ROOT_NODE_PID',
        children: o2oMatchedPermissionRoutes,
      },
    ],
    {
      id: 'id',
      pid: 'pid',
      path: 'path',
      name: 'name',
      redirect: 'redirect',
      meta: 'meta',
      component: 'component',
      children: 'children',
      sort: 'sort',
    }
  )

  const tempFullTree = ablePermissionRoutesFullTree[0]
  ablePermissionRoutesFullTree = cloneDeep(rootRoute)
  ablePermissionRoutesFullTree.children = [
    ...ablePermissionRoutesFullTree.children,
    ...(tempFullTree.children || []),
  ]

  // 动态添加权限路由到路由router
  if (ablePermissionRoutesFullTree.children) {
    ablePermissionRoutesFullTree.children.forEach((route) => {
      router.addRoute('Root', route)
    })
  }

  // 保存权限菜单
  updateAblePermissionRoutesFullTree(ablePermissionRoutesFullTree)

  // 保存权限按钮
  const ablePermissionButtons = onlinePermissionList
    .filter((route) => {
      return route.type === 'button'
    })
    .map((route) => {
      return route.code
    })
  updateAblePermissionButtons(ablePermissionButtons)
}
