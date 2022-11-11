import { createRouter, createWebHashHistory } from 'vue-router'
import { nextTick } from 'vue'
import { auth } from '@/scripts/auth'

import 'vue-router'

declare module 'vue-router' {
	interface RouteMeta {
		title: string
		requiresAuth?: boolean
	}
}

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: () => import('../views/IndexView.vue'),
			meta: {
				title: 'Выбор города',
				requiresAuth: true
			},
		},
		{
			path: '/calendar/:roomId/:placeId',
			component: () => import('../views/CalendarView.vue'),
			meta: {
				title: 'Календарь',
				requiresAuth: true
			},
		},
		{
			path: '/schedule',
			component: () => import('../views/ScheduleView.vue'),
			meta: {
				title: 'Расписание',
				requiresAuth: true
			},
		},
		{
			path: '/profile',
			component: () => import('../views/ProfileView.vue'),
			meta: {
				title: 'Мой профиль',
				requiresAuth: true
			},
		},
		{
			path: '/office/:officeId',
			component: () => import('../views/OfficeView.vue'),
			meta: {
				title: 'Выбор помещения',
				requiresAuth: true
			},
		},
		{
			path: '/login',
			component: () => import('../views/LoginView.vue'),
			meta: {
				title: 'Авторизация',
			},
		},
		{
			path: '/reg',
			component: () => import('../views/RegView.vue'),
			meta: {
				title: 'Регистрация',
			},
		},
		{
			path: '/restore',
			component: () => import('../views/RestoreView.vue'),
			meta: {
				title: 'Восстановление пароля',
			},
		},
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../views/404View.vue'),
			meta: {
				title: 'Страница не найдена',
			},
		},
	],
})

router.beforeEach((to, from) => {
	if (to.meta.requiresAuth && !auth.isLoggedIn) {
		return {
			path: '/login',
			// query: { redirect: to.fullPath },
		}
	}
})

router.afterEach((to, from) => {
	nextTick(() => {
		document.title = to.meta.title + ' | PARMA Technologies Group' || 'PARMA Technologies Group'
	}).then()
})

export default router
