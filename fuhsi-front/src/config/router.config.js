// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            hidden: true,
            component: () => import('@/views/dashboard/Monitor'),
            meta: { title: '监控页', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      // application
      {
        path: '/application',
        redirect: '/application/app',
        component: PageView,
        meta: { title: '应用管理', icon: 'appstore', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/application/app',
            name: 'applist',
            component: () => import('@/views/application/app/AppList'),
            meta: { title: '应用列表', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/application/app/add',
            name: 'appadd',
            component: () => import('@/views/application/app/StepForm'),
            meta: { title: '应用发布', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/application/config/list',
            name: 'configlist',
            component: () => import('@/views/application/config/ConfigList'),
            meta: { title: '应用配置', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/application/registry/list',
            name: 'registrylist',
            component: () => import('@/views/application/registry/RegistryList'),
            meta: { title: '镜像管理', keepAlive: false, permission: [ 'dashboard' ] }
          }
        ]
      },
      // forms
      {
        path: '/ci',
        redirect: '/ci/base-form',
        component: PageView,
        meta: { title: '持续集成', icon: 'interation', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/ci/step-form',
            name: 'StepForm',
            component: () => import('@/views/ci/stepForm/StepForm'),
            meta: { title: '构建项目', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/ci/base-form',
            name: 'BaseForm',
            component: () => import('@/views/ci/BasicForm'),
            meta: { title: '构建历史', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/ci/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/ci/advancedForm/AdvancedForm'),
            meta: { title: '流水线', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/ci/CodeList',
            name: 'CodeList',
            component: () => import('@/views/ci/CodeList'),
            meta: { title: '代码仓库', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      // 基础设施
      {
        path: '/base',
        name: 'base',
        component: PageView,
        redirect: '/base/query-list',
        meta: { title: '基础设施', icon: 'radar-chart', hiddenHeaderContent: true, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/base/cluster',
            name: 'cluster',
            hiddenHeaderContent: true,
            component: () => import('@/views/base/ClusterList'),
            meta: { title: '群集管理', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/base/query-list',
            name: 'QueryListWrapper',
            hiddenHeaderContent: true,
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/base/TableList'),
            meta: { title: '证书管理', permission: [ 'dashboard' ] }
          },
          {
            hiddenHeaderContent: true,
            path: '/base/quota-list',
            name: 'QuotaList',
            component: () => import('@/views/resourse/QuotaList'),
            meta: { title: '资源配置', keepAlive: false, permission: [ 'dashboard' ] }
          }
        ]
      },
      // system
      {
        path: '/system',
        name: 'system',
        component: PageView,
        redirect: '/system/query-list',
        meta: { title: '系统配置', icon: 'setting', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/system/user-list',
            name: 'UserList',
            component: () => import('@/views/system/UserList'),
            meta: { title: '用户列表', keepAlive: true, hiddenHeaderContent: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/system/role-list',
            name: 'RoleList',
            component: () => import('@/views/system/RoleList'),
            meta: { title: '角色列表', keepAlive: true, hiddenHeaderContent: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/system/system-role',
            name: 'SystemRole',
            component: () => import('@/views/system/RoleList'),
            meta: { title: '角色列表2', keepAlive: true, hiddenHeaderContent: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/system/permission-list',
            name: 'PermissionList',
            component: () => import('@/views/system/PermissionList'),
            meta: { title: '权限列表', keepAlive: true, hiddenHeaderContent: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      // 子页面
      {
        path: '/base/detail/:name',
        name: 'base2',
        hidden: true,
        component: RouteView,
        redirect: '/base/clusterdetail/:name',
        meta: { title: '基础设施', icon: 'radar-chart', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/base/clusterdetail/:name',
            name: 'clusterdetail',
            props: true,
            hiddenHeaderContent: true,
            component: () => import('@/views/base/ClusterDetail'),
            meta: { title: '群集详情', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/application/appdetail/:id',
            name: 'appdetail',
            props: true,
            hidden: true,
            component: () => import('@/views/application/app/AppDetail'),
            meta: { title: '应用详情', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            hiddenHeaderContent: true,
            path: '/base/quota-view',
            name: 'QuotaView',
            component: () => import('@/views/resourse/QuotaView'),
            meta: { title: '资源详情', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/application/servicedetail/:id',
            name: 'servicedetail',
            hidden: true,
            component: () => import('@/views/application/service/ServiceDetail'),
            meta: { title: '服务详情', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/auth/tenants/clients',
            name: 'clients',
            hidden: true,
            component: () => import('@/views/authcenter/TenantClientList'),
            meta: { title: '服务详情', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/auth/tenants/accounts',
            name: 'accounts',
            hidden: true,
            component: () => import('@/views/authcenter/TenantAccountList'),
            meta: { title: '服务详情', keepAlive: false, permission: [ 'dashboard' ] }
          }
        ]
      },
      // authcenter
      {
        path: '/auth',
        name: 'auth',
        component: PageView,
        redirect: '/auth/tenants',
        meta: { title: '授权中心', icon: 'profile', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/auth/tenants',
            name: 'tenants',
            component: () => import('@/views/authcenter/TenantList'),
            meta: { title: '租户管理', permission: [ 'dashboard' ] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '账号管理', permission: [ 'dashboard' ] }
          }
        ]
      }
      // ,
      // // profile
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   component: RouteView,
      //   redirect: '/profile/basic',
      //   meta: { title: '授权中心', icon: 'profile', permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/profile/basic',
      //       name: 'ProfileBasic',
      //       component: () => import('@/views/profile/basic/Index'),
      //       meta: { title: '租户管理', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'ProfileAdvanced',
      //       component: () => import('@/views/profile/advanced/Advanced'),
      //       meta: { title: '账号管理', permission: [ 'dashboard' ] }
      //     }
      //   ]
      // }
      // // result
      // {
      //   path: '/result',
      //   name: 'result',
      //   component: PageView,
      //   redirect: '/result/success',
      //   meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/result/success',
      //       name: 'ResultSuccess',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
      //       meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/result/fail',
      //       name: 'ResultFail',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
      //       meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'dashboard' ] }
      //     }
      //   ]
      // },

      // // Exception
      // {
      //   path: '/exception',
      //   name: 'exception',
      //   component: RouteView,
      //   redirect: '/exception/403',
      //   meta: { title: '异常页', icon: 'warning', permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/exception/403',
      //       name: 'Exception403',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      //       meta: { title: '403', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'Exception404',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      //       meta: { title: '404', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'Exception500',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      //       meta: { title: '500', permission: [ 'dashboard' ] }
      //     }
      //   ]
      // },

      // // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/center',
      //   name: 'account',
      //   meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: () => import('@/views/account/center/Index'),
      //       meta: { title: '个人中心', keepAlive: true, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: '个人设置', hideHeader: true, permission: [ 'dashboard' ] },
      //       redirect: '/account/settings/base',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('@/views/account/settings/BaseSetting'),
      //           meta: { title: '基本设置', hidden: true, permission: [ 'dashboard' ] }
      //         },
      //         {
      //           path: '/account/settings/security',
      //           name: 'SecuritySettings',
      //           component: () => import('@/views/account/settings/Security'),
      //           meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'dashboard' ] }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'dashboard' ] }
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           name: 'BindingSettings',
      //           component: () => import('@/views/account/settings/Binding'),
      //           meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'dashboard' ] }
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           name: 'NotificationSettings',
      //           component: () => import('@/views/account/settings/Notification'),
      //           meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'dashboard' ] }
      //         }
      //       ]
      //     }
      //   ]
      // },

      // // other
      // {
      //   path: '/other',
      //   name: 'otherPage',
      //   component: PageView,
      //   meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
      //   redirect: '/other/icon-selector',
      //   children: [
      //     {
      //       path: '/other/icon-selector',
      //       name: 'TestIconSelect',
      //       component: () => import('@/views/other/IconSelectorView'),
      //       meta: { title: 'IconSelector', keepAlive: true, permission: [ 'dashboard' ] }
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
