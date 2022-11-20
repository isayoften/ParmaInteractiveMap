<template>
	<div class="w-full h-[1px] min-h-[calc(100vh-160px)] flex justify-between text-left">
		<div class="w-full h-full space-y-12">
			<div class="text-4xl font-bold">Офис {{ roomId }}, {{ placeId }} стол</div>
			<div class="w-full h-[calc(100%-112px)] p-8 bg-gray-50 space-y-4">
				<div class="text-2xl font-bold">Расписание</div>
				<div class="w-full h-[calc(100%-50px)] flex justify-between">
					<div class="w-max p-4 space-y-2 bg-white">
						<div class="flex justify-between text-2xl font-bold">
							<div>ДЕКАБРЬ</div>
							<div>2022</div>
						</div>
						<div class="w-[567px] flex flex-wrap text-[0.55rem] font-bold border box-content">
							<div class="w-[81px] text-center border" v-for="day in days">
								{{ day }}
							</div>

							<div class="relative w-[81px] h-[55px] p-1 flex border" v-for="i in 35">
								<div v-show="1 <= i - 3 && i - 3 <= 31"
								     :class="(getState(i - 3) !== 'cancel') && 'cursor-pointer'"
								     @click="toggleDate(createDate(i-3), true)">
									<div>{{ i - 3 }}</div>
									<img class="absolute left-1/2 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2"
									     :alt="`status ${createDate(i - 3)}`"
									     :src="`/images/${getState(i - 3)}.svg`">
								</div>
							</div>
						</div>
					</div>

					<div class="w-full h-full flex flex-col justify-center">
						<div class="flex-1 space-y-4">
							<div class="w-[300px] p-4 mx-auto bg-red text-white text-center text-2xl font-bold
									    cursor-pointer"
							     v-show="getDatesOfMyPlaces().length"
							     @click="cancelBook()">
								Снять бронь
							</div>
							<div class="text-sm text-center underline underline-offset-4">Отмена брони возможна лишь за
								24 часа!
							</div>
						</div>

						<div class="w-[350px] mx-auto space-y-2 text-center text-xl">
							<div class="px-4 border rounded-full bg-green cursor-pointer"
							     :class="!isBookingAvailable(1) && '!bg-white'"
							     @click="book(1)">
								Забронировать на завтра
							</div>
							<div class="px-4 border rounded-full bg-green cursor-pointer"
							     :class="!isBookingAvailable(2) && '!bg-white'"
							     @click="book(undefined)">
								Забронировать на ... дней
							</div>
							<div class="px-4 border rounded-full bg-green cursor-pointer"
							     :class="!isBookingAvailable(7) && '!bg-white'"
							     @click="book(7)">
								Забронировать на неделю
							</div>
							<div class="px-4 border rounded-full bg-white cursor-default">
								Забронировать на месяц
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { createDate, getCurrentDay, getNextDate } from '@/scripts/utils'
import { saveSchedule, schedule } from '@/scripts/schedule'
import { auth } from '@/scripts/auth'

const days = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'].map(value => value.toUpperCase())

const roomId = +useRoute().params.roomId
const placeId = +useRoute().params.placeId

const floor = +roomId.toString().slice(0, 1)
const roomIndex = +roomId.toString().slice(-1) - 1
const placeIndex = placeId - 1

function cancelBook() {
	if (!confirm('Вы уверены, что хотите снять бронь?')) return

	const dates = getDatesOfMyPlaces()

	for (const date of dates)
		schedule.value[date][floor - 1][roomIndex][placeIndex] = null

	saveSchedule()
}

function getDatesOfMyPlaces() {
	const dates: string[] = []

	for (let day = getCurrentDay() + 1; day <= 31; day++) {
		const holder = schedule.value[createDate(day)][floor - 1][roomIndex][placeIndex]

		if (!holder) continue

		if (holder.id === auth.user.id)
			dates.push(createDate(day))
	}

	return dates
}

function getState(day: number) {
	const holder = schedule.value[createDate(day)][floor - 1][roomIndex][placeIndex]

	if (day <= getCurrentDay()) return 'cancel'
	if (holder) {
		if (holder.id === auth.user.id) return 'booked'
		return 'cancel'
	}

	return 'ok'
}

function isBookingAvailable(days: number) {
	for (let i = 1; i <= days; i++)
		if (schedule.value[getNextDate(i)][floor - 1][roomIndex][placeIndex] &&
		    schedule.value[getNextDate(i)][floor - 1][roomIndex][placeIndex]!.id !== auth.user.id)
			return false

	return true
}

function book(days: number | undefined) {
	if (!isBookingAvailable(1)) return
	if (!days) days = +prompt('Введите количество дней')!
	if (!days) return

	if (!isBookingAvailable(days)) return

	if (!confirm(`Вы уверены, что хотите забронировать место до ${new Date(getNextDate(days)).toLocaleDateString()}?\nКоличество дней: ${days}`))
		return

	for (let i = 1; i <= days; i++)
		bookDate(getNextDate(i))
}

function bookDate(date: string, isAlert = false) {
	if (schedule.value[date][floor - 1][roomIndex][placeIndex]) return

	if (isAlert)
		if (!confirm(`Вы уверены, что хотите забронировать место на ${new Date(date).toLocaleDateString()}?`))
			return

	schedule.value[date][floor - 1][roomIndex][placeIndex] = JSON.parse(JSON.stringify(auth.user))

	saveSchedule()
}

function toggleDate(date: string, isAlert = false) {
	if (schedule.value[date][floor - 1][roomIndex][placeIndex] &&
	    schedule.value[date][floor - 1][roomIndex][placeIndex]!.id !== auth.user.id) return

	if (!schedule.value[date][floor - 1][roomIndex][placeIndex]) {
		bookDate(date, isAlert)
		return
	}

	if (!confirm(`Вы уверены, что хотите снять бронь на ${new Date(date).toLocaleDateString()}?`)) return

	schedule.value[date][floor - 1][roomIndex][placeIndex] = null

	saveSchedule()
}
</script>
