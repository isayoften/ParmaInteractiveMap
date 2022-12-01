<template>
	<div class="space-y-2">
		<div class="text-2xl font-bold">Необходимо внести некоторые данные!</div>
		<div class="w-[500px] mx-auto p-8 bg-black-500">
			<div class="w-[300px] mx-auto space-y-12">
				<div class="w-full flex flex-col space-y-4">
					<input class="login-form" type="text" placeholder="ФИО" v-model="name">
					<input class="login-form" type="text" placeholder="Телефон" @keyup="formatPhone($event)">
					<input class="login-form" type="text" placeholder="Почта" v-model="mail">
					<input class="login-form" type="password" placeholder="Пароль" v-model="pass" @keydown.enter="reg">
				</div>
				<div class="w-full flex flex-col space-y-4 text-white text-2xl font-bold">
					<button class="p-2 bg-red" @click="reg">Регистрация</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createUser, users } from '@/scripts/users'

const name = ref('')
const phone = ref('')
const mail = ref('')
const pass = ref('')

let lastValue = ''
function formatPhone(event: KeyboardEvent) {
	if (event.code === 'Backspace' || event.code === 'Delete') return

	const $input = <HTMLInputElement>event.target
	let value = $input.value

	if (lastValue === value) return

	value = value.replace(/ /g, '').replace(/\D/g, '')
	let newValue = ''
	for (const char of value) {
		newValue += char

		if (newValue === '7' || newValue === '8')
			newValue = '+7'

		if (newValue.length === 2 ||
		    newValue.length === 6 ||
		    newValue.length === 10 ||
		    newValue.length === 13)
			newValue += ' '
	}

	newValue = newValue.slice(0, 16)

	lastValue = newValue
	$input.value = newValue

	phone.value = newValue
}

function reg() {
	try {
		const [lastName, firstName, patronymic] = name.value.split(' ')

		createUser({
			lastName, firstName, patronymic,
			phone: phone.value,
			mail: mail.value,
			password: pass.value,
		})

		alert('Аккаунт успешно зарегистрирован')
	} catch (error) {
		alert(`Произошла ошибка: ${error}`)
	}
}
</script>