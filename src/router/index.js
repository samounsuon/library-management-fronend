import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MemberView from '@/views/MemberView.vue'
import BookVue from '@/views/BookVue.vue'
import CategoryTable from '@/views/CategoryTable.vue'
// import Register from '@/views/Register.vue'
// import Register from '@/components/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/member',
      name: 'member',
      component: MemberView,
    },
    {
      path: '/books',
      name: 'books',
      component: BookVue,
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryTable,
    },
    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
