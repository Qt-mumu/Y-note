import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Index from '../views/performs/Index.vue'
import Note from '../views/performs/Note.vue'
import UserEdit from '../views/UserEdit'
import UserList from '../views/UserList'
import CategoryList from '../views/CategoryList'

Vue.use(VueRouter)

const routes = [
	{ path: '/login', name: 'login', component: Login, meta: { ispublic: true }},
	{ path: '/index', name: 'index', component: Index},
	{ path: '/note', name: 'note', component: Note},
	{ path: '/note/edit/:id', component: Note, props: true},
	{
		path: '/',
		name: 'Main',
		component: Main,
		children: [
			{path: '/users/create', component: UserEdit},
			{path: '/users/edit/:id', component: UserEdit, props: true},
			{path: '/users/list', component: UserList},
			{path: '/categories/list', component: CategoryList},
		]
		},
	]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
	// if (!to.meta.isPublish && !localStorage.token) {
	// 	return next({name: 'login'})
	// }else next()
	if (!to.meta.isPublish && !localStorage.token)  next({ name: 'login' })
	else next()
})

export default router
