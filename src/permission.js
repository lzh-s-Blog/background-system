import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist 白名单，不需要权限验证的

// 路由前置守卫
router.beforeEach(async(to, from, next) => { 
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()

  const hasGetUserInfo = store.getters.user; // 获取本地用户信息


  // 首先判断是否需要权限
  if (to.meta.auth) {
    // 说明页面需要鉴权
    // 然后判断是否有本地用户信息
    if (hasGetUserInfo) {
      // 进入此if，说明有用户信息，直接放行
      next();
    } else {
      // 没有用户信息，判断是否有token
      const hasToken = localStorage.getItem('adminToken');
      if (hasToken) {
        // 如果有token 还需要验证token是否有效
        try {
          await store.dispatch('user/getInfo'); //相当于whoami ,如果拿不到用户信息无效就会进入catch
          next();
        } catch(error) {
          await store.dispatch('user/resetToken');
          Message.error('登录过期，请重新登录')
          next(`/login?redirct=${to.path}`);
          NProgress.done();
        }
      } else {
        // 说明没有token，需要重新进行登录
        next(`/login?redirct=${to.path}`);
        NProgress.done();
      }
    }
  } else {
    // 不需要鉴权
    if (to.path === '/login' && hasGetUserInfo) {
      // 如果是去的login
      // 说明你现在是在登录的状态下，要去login页面，我们要将其导航到首页
      next({path: '/'})
    } else {
      next();
    }
    NProgress.done(); // 让进度条走完
  }

// 下方是 vue-element-admin 原本的鉴权流程
/*   // 如果有token
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 进的是login直接放行
      next({ path: '/' })
      NProgress.done()
    } else {  
      // 如果进的不是login
      // 看一下是否有用户信息
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 如果有用户信息，放行
        next()
      } else {
        // 说明没有用户信息，但是有token，可以用localStorage里面的token去服务器拿用户信息
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // has no token

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 如果不在白名单内的，导航到登录
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  } */
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
