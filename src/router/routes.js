
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'houseFrontpage', component: () => import('pages/houseFrontpage.vue') },
      { path: 'administerUsersPage', component: () => import('pages/administerUsersPage.vue') },
      { path: 'bookingPage', component: () => import('pages/bookingPage.vue') },
      { path: 'repairPage', component: () => import('pages/repairPage.vue') },
      { path: 'informationPage', component: () => import('pages/informationPage.vue') },
      { path: 'documentPage', component: () => import('pages/documentPage.vue') },
      { path: 'galleryPage', component: () => import('pages/galleryPage.vue') },
      { path: 'profilePage', component: () => import('pages/profilePage.vue') },
      { path: 'termsPage', component: () => import('pages/termsPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
