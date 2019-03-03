import Profile from '@/components/profile'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      // component: HelloWorld
    },
    {path: '/u/:account', name: 'profile', component: Profile},
  ]
})

router.beforeEach((to, from, next) => {
  // iView.LoadingBar.start();
  next();
});

export default router
