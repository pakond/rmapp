const routes = [
  {
    path: '',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'retailer',
        component: () => import('pages/Retailer.vue')
      },
      {
        path: 'provider',
        component: () => import('pages/Provider.vue')
      }
    ]
  },
  {
    path: '/smartphones',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Smartphones.vue')
      },
      {
        path: ':id',
        component: () => import('pages/SmartphonesDetail.vue')
      }
    ]
  },
  {
    path: '/change_password',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PasswordChange.vue')
      }
    ]
  },
  {
    path: '/profile',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Profile.vue')
      }
    ]
  },
  {
    path: '/storehouses',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Storehouses.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Centered.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Login.vue')
      }
    ]
  },
  {
    path: '/reset_password',
    component: () => import('layouts/Centered.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PasswordReset.vue')
      },
      {
        path: ':token',
        component: () => import('pages/PasswordResetVerify.vue')
      }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/Centered.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Register.vue')
      },
      {
        path: 'company',
        component: () => import('pages/RegisterCompany.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
