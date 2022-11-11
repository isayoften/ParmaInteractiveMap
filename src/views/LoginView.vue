<template>
	<div class="w-[500px] mx-auto p-8 bg-black-500">
		<div class="w-[300px] mx-auto space-y-12">
			<div class="w-full flex flex-col space-y-4">
				<input class="login-form" type="text" placeholder="Логин" v-model="l">
				<input class="login-form" type="password" placeholder="Пароль" v-model="p" @keydown.enter="login">
				<RouterLink class="text-white text-xl underline underline-offset-4" to="/restore">
					Забыли пароль?
				</RouterLink>
			</div>
			<div class="w-full flex flex-col space-y-4 text-white text-2xl font-bold">
				<button class="p-2 bg-red" @click="login">Войти</button>
				<RouterLink to="/reg">Регистрация</RouterLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { auth } from '@/scripts/auth'
import { ref } from 'vue'

const l = ref()
const p = ref()

function login() {
	if (!auth.login(l.value, p.value))
		alert('Проверьте правильность введённых данных')
}
</script>