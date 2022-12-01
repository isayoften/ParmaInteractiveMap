import { ref } from 'vue'
import router from '@/router'
import type { User } from '@/scripts/users'
import { getUser } from '@/scripts/users'

export const auth = {
	isLoggedInRef: ref(!!sessionStorage.getItem('user')),
	
	get isLoggedIn() { return !!this.user },
	
	get user() { return JSON.parse(sessionStorage.getItem('user') || '""') },
	set user(value: User) {
		sessionStorage.setItem('user', JSON.stringify(value))
		this.isLoggedInRef.value = this.isLoggedIn
	},
	
	login(l: string, p: string) {
		const user = getUser(l, p)
		
		if (!user) return false
		this.user = user
		
		router.push('/').then()
		return true
	},
	
	// logout() {
	// 	localStorage.setItem('user', '')
	// 	this.isLoggedInRef.value = false
	// },
}
