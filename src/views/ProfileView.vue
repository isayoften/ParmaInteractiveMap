<template>
	<div class="w-full h-[1px] min-h-[calc(100vh-160px)] flex justify-between text-left">
		<div class="w-[41%] h-full space-y-4 ">
			<div class="text-4xl font-bold">Мой профиль</div>
			<div class="w-full h-[calc(100%-112px)] p-8 bg-black-500">
				<div class="h-full flex flex-col justify-between">
					<div class="flex space-x-16">
						<img class="w-[164px] min-h-[150px] bg-gray" :src="auth.user.imageUrl" alt="">
						<div class="w-[240px] space-y-2">
							<div class="relative" v-for="item in fields">
								<input class="w-full px-4 text-2xl rounded-full" type="text" v-model="item.text"
								       :disabled="!item.isEdited">
								<img class="absolute -right-[75px] top-0 w-8 cursor-pointer" src="/images/pencil.svg"
								     alt="pencil"
								     v-show="isEdited" @click="item.isEdited = !item.isEdited">
							</div>
						</div>
					</div>

					<div class="w-max px-4 text-2xl rounded-xl bg-red cursor-pointer" @click="toggleEdit()">
						Редактировать данные
					</div>
				</div>
			</div>
		</div>

		<div class="w-[40%] h-full space-y-4">
			<div class="text-4xl font-bold">Мои брони</div>
			<div class="w-full h-[calc(100%-112px)] overflow-y-auto p-8 px-6 space-y-2 bg-black-500 text-center">
				<div class="px-2 text-2xl rounded-full whitespace-nowrap"
				     :class="place.isActive ? 'bg-green' : 'bg-white'"
				     v-for="place in getMyBookedPlaces()">
					{{ place.floor }} этаж, офис {{ place.room }}, место {{ place.place }} {{ place.date }}
				</div>
<!--				<div class="px-4 text-2xl rounded-full bg-white">1 этаж, офис 101, место 1 08.08.22</div>-->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { auth } from '@/scripts/auth'
import { schedule } from '@/scripts/schedule'
import { createDate, getCurrentDay } from '@/scripts/utils'

const isEdited = ref(false)
const fields = ref([
	{ text: auth.user.lastName, isEdited: false },
	{ text: auth.user.firstName, isEdited: false },
	{ text: auth.user.patronymic, isEdited: false },
	{ text: auth.user.phone, isEdited: false },
	{ text: auth.user.mail, isEdited: false },
])

watch(fields, (value) => {
	const user = auth.user

	user.lastName = value[0].text
	user.firstName = value[1].text
	user.patronymic = value[2].text
	user.phone = value[3].text
	user.mail = value[4].text

	auth.user = user
}, { deep: true })

function getMyBookedPlaces() {
	const myBookedPlaces: {
		date: string
		floor: number
		room: number
		place: number
		isActive: boolean
	}[] = []

	for (let day = 1; day <= 31; day++)
		for (const floorIndex in schedule.value[createDate(day)])
			for (const roomIndex in schedule.value[createDate(day)][floorIndex])
				for (const placeIndex in schedule.value[createDate(day)][floorIndex][roomIndex])
					if (schedule.value[createDate(day)][floorIndex][roomIndex][placeIndex] &&
					    schedule.value[createDate(day)][floorIndex][roomIndex][placeIndex]!.id === auth.user.id)
						myBookedPlaces.push({
							place: +placeIndex + 1,
							floor: +floorIndex + 1,
							room: (+floorIndex + 1) * 100 + +roomIndex + 1,
							date: new Date(createDate(day)).toLocaleDateString(),
							isActive: getCurrentDay() < day,
						})

	return myBookedPlaces.reverse()
}

function toggleEdit() {
	isEdited.value = !isEdited.value

	if (!isEdited.value)
		for (const field of fields.value)
			field.isEdited = false
}
</script>
