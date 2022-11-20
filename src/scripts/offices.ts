import { ref } from 'vue'

export const offices = [
	{
		id: 0,
		street: 'Мытная ул., 66, Москва',
		imageUrl: '/images/office1.png',
	},
	{
		id: 1,
		street: 'ул. Ленина, 77А, Пермь',
		imageUrl: '/images/office2.png',
	},
]

export const currentOffice = ref<undefined | typeof offices[number]>()

export function setCurrentOffice(id: number) {
	currentOffice.value = offices.find(value => value.id === id)
}