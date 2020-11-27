import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
const User_Main = () => import('@/components/user/Main');
const User_Main_Tasks = () => import('@/components/user/MainTasks');

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/user/main',
      name: 'User_Main',
      component: User_Main,
      redirect: { name: 'User_Main_Tasks' },
      children: [
        {
          name: 'User_Main_Tasks',
          path: 'tasks',
          component: User_Main_Tasks
        },
      ]
    }
  ]
})
