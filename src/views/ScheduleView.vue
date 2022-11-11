<template>
	<div class="w-full h-[1px] min-h-[calc(100vh-160px)] flex justify-between text-left">
		<div class="w-full h-full space-y-12">
			<div class="text-4xl font-bold">Расписание бронирования</div>
			<div class="w-full min-h-[calc(100%-112px)] p-8 bg-gray-50 space-y-4">
				<div class="flex justify-between">
					<div class="flex items-center space-x-8 text-2xl font-bold">
						<div>{{ +date.split('-')[2] }} декабря 2022 г.</div>
						<div class="relative">
							<input class="absolute opacity-0" type="date" id="date" v-model="date"
							       min="2022-12-01" max="2022-12-31">
							<img class="relative w-[30px] z-50 cursor-pointer" src="/images/calendar.svg" alt="calendar"
							     onclick="document.getElementById('date').showPicker()">
						</div>
					</div>

					<div class="px-4 ml-auto flex border border-2 bg-white rounded-full space-x-8"
					     onclick="document.getElementById('search').focus()">

						<img class="w-[1.5rem] pointer-events-none" src="/images/search.svg" alt="search">
						<input class="w-[275px] h-max my-auto text-2xl font-bold placeholder-gray-50 outline-none"
						       id="search" type="text" placeholder="Поиск сотрудника" autocomplete="off">
					</div>
				</div>

				<div class="w-full h-[calc(100%-50px)] flex flex-col space-y-4 text-2xl">
					<div class="h-max w-1/2 p-4 space-y-2 text-white bg-black-500 border-2 border-black"
					     v-for="bookedRoom in getBookedRooms()">
						<div>Офис {{ bookedRoom.room }}</div>

						<div class="px-1 flex [&>*]:w-[calc(100%/3)] text-black bg-white rounded"
						     v-for="place in bookedRoom.places">
							<div>{{ place.place }} место</div>
							<div>ЗАНЯТО</div>
							<div class="group relative text-red cursor-default">
								<div>ПОСМОТРЕТЬ</div>
								<div class="group-hover:block hidden absolute left-full bottom-full p-4 text-black bg-white/50 backdrop-blur-sm border-2
											w-max h-max z-50">
									<div class="flex space-x-4">
										<img class="min-w-[100px] h-[150px] bg-gray" :src="place.holder.imageUrl" alt="">
										<div class="space-y-4">
											<div>
												<div>{{ place.holder.lastName }}</div>
												<div>{{ place.holder.firstName }}</div>
												<div>{{ place.holder.patronymic }}</div>
											</div>

											<div>{{ place.holder.phone }}</div>
											<div>{{ place.holder.mail }}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCurrentDate } from '@/scripts/utils'
import { schedule } from '@/scripts/schedule'

const date = ref(getCurrentDate())

function getBookedRooms() {
	const bookedRooms: {
		floor: number,
		room: number,
		places: {
			place: number
			holder: any
		}[],
	}[] = []

	for (const floorIndex in schedule.value[date.value])
		for (const roomIndex in schedule.value[date.value][floorIndex]) {
			const places: {
				place: number
				holder: any
			}[] = []

			for (const placeIndex in schedule.value[date.value][floorIndex][roomIndex])
				if (schedule.value[date.value][floorIndex][roomIndex][placeIndex])
					places.push({
						place: +placeIndex + 1,
						holder: schedule.value[date.value][floorIndex][roomIndex][placeIndex],
					})

			if (places.length)
				bookedRooms.push({
					places,
					floor: +floorIndex + 1,
					room: (+floorIndex + 1) * 100 + +roomIndex + 1,
				})
		}

	return bookedRooms
}
</script>
