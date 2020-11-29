import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
const User_Main = () => import('@/components/user/Main');
const User_Main_Tasks = () => import('@/components/user/main/Tasks');
const User_Main_Courses = () => import('@/components/user/main/Courses');
const User_Main_Me = () => import('@/components/user/main/Me');
const User_Me_Courses = () => import('@/components/user/me/courses');

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
        {
          name: 'User_Main_Courses',
          path: 'courses',
          component: User_Main_Courses
        },
        {
          name: 'User_Main_Me',
          path: 'me',
          component: User_Main_Me
        },
      ]
    },
    {
      path: '/me/course',
      name: 'User_Me_Courses',
      component: User_Me_Courses
    },
  ]
})
