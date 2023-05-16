// Composables
import { createRouter, createWebHistory } from 'vue-router'

// layouts
const LayoutDefault = () => import('@/layouts/default/Default.vue')

// views
const Home = () => import('@/views/Home/index.vue')

const routes = [
  {
    path: '/',
    component: LayoutDefault,
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Home,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
