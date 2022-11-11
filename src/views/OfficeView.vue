<template>
	<div class="w-full min-h-[calc(100vh-160px)] text-left space-y-8">
		<div class="min-h-[inherit] flex flex-col justify-between">
			<div class="flex h-[75px]">
				<div class="flex space-x-16">
					<RouterLink to="/profile">
						<img class="h-full" src="/images/user.svg" alt="user">
					</RouterLink>
					<RouterLink to="/schedule">
						<img class="h-full" src="/images/calendar-image.svg" alt="calendar">
					</RouterLink>
				</div>
				<div class="px-10 py-4 ml-auto flex border border-2 rounded-full space-x-8"
				     onclick="document.getElementById('search').focus()">

					<img class="pointer-events-none" src="/images/search.svg" alt="search">
					<input class="w-[300px] h-max my-auto text-3xl font-bold placeholder-gray-50 outline-none"
					       id="search" type="text" placeholder="Поиск сотрудника" autocomplete="off">
				</div>
			</div>

			<div class="flex justify-between items-end">
				<div class="w-[75px] h-[414px] flex flex-col justify-between">
					<div class="cursor-pointer"
					     v-if="auth.user.isAdmin"
					     @click="isEdited = !isEdited">
						<img class="w-full" src="/images/pencil.svg" alt="edit">
					</div>
					<div class="p-4 mt-auto flex flex-col space-y-4 text-center bg-gray-50">
						<div class="font-bold">Этаж</div>
						<div class="cursor-pointer select-none" v-html="floorIcons[i - 1]" v-for="i in 4"
						     :class="currentFloor === i && 'text-red'" @click="currentFloor = i"/>
					</div>
				</div>

				<div class="w-[70%] min-h-[414px] bg-gray-50">
					<div class="w-[550px] min-h-[inherit] flex py-8 mx-auto">
						<div class="relative flex flex-1 flex-wrap gap-[50px]">
							<div class="relative w-[150px] h-[150px] bg-white"
							     v-for="(room, i) in schedule[currentDate][currentFloor - 1]">
								<div class="h-[calc(100%-24px)] flex flex-wrap">
									<div class="group relative w-[20%] h-[20%] m-[15%] bg-black cursor-pointer"
									     v-for="(place, placeId) in room"
									     :class="place ? 'text-red' : 'text-green'"
									     @click="openCalendar(currentFloor * 100 + i + 1, placeId + 1)">

										<svg class="absolute left-0 bottom-1/2 w-full" viewBox="0 0 45 58" fill="none"
										     xmlns="http://www.w3.org/2000/svg">
											<path
												d="M22.0778 0C9.90122 0 0.0529785 9.32409 0.0529785 20.8526C0.0529785 33.2748 13.9601 50.4037 19.6865 56.9276C20.9451 58.3575 23.242 58.3575 24.5005 56.9276C30.1955 50.4037 44.1026 33.2748 44.1026 20.8526C44.1026 9.32409 34.2544 0 22.0778 0ZM22.0778 28.2999C17.7358 28.2999 14.2118 24.9635 14.2118 20.8526C14.2118 16.7417 17.7358 13.4052 22.0778 13.4052C26.4198 13.4052 29.9438 16.7417 29.9438 20.8526C29.9438 24.9635 26.4198 28.2999 22.0778 28.2999Z"
												fill="currentColor"/>
										</svg>

										<div v-if="place"
										     class="group-hover:block hidden absolute left-full bottom-full p-4 text-black bg-white/50 backdrop-blur-sm border-2
													w-max h-max z-50">
											<div class="flex space-x-4">
												<img class="min-w-[100px] h-[150px] bg-gray" :src="place.imageUrl" alt="">
												<div class="space-y-4">
													<div>
														<div>{{ place.lastName }}</div>
														<div>{{ place.firstName }}</div>
														<div>{{ place.patronymic }}</div>
													</div>

													<div>{{ place.phone }}</div>
													<div>{{ place.mail }}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="text-center font-bold">{{ currentFloor * 100 + i + 1 }}</div>
								<img class="absolute w-[30px] -top-5 -right-4 cursor-pointer" src="/images/trash.svg"
								     alt="trash" v-show="isEdited" @click="removeRoom(currentFloor, i)">
							</div>
							<img class="absolute right-0 bottom-0 w-[50px] cursor-pointer" src="/images/plus.svg"
							     alt="plus" v-show="isEdited && schedule[currentDate][currentFloor - 1].length < 6"
							     @click="createRoom(currentFloor)">
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { setCurrentOffice } from '@/scripts/offices'
import { ref } from 'vue'
import { createRoom, removeRoom, schedule } from '@/scripts/schedule'
import { getCurrentDate } from '@/scripts/utils'
import { auth } from '@/scripts/auth'

const router = useRouter()
const isEdited = ref(false)
const currentFloor = ref(1)
const officeId = +useRoute().params.officeId

const currentDate = getCurrentDate()
const floorIcons = [
	`<svg class="w-full" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.54545 9.09091H0V45.4545C0 47.9545 2.04545 50 4.54545 50H40.9091V45.4545H4.54545V9.09091ZM29.5455 31.8182H34.0909V9.09091H25V13.6364H29.5455V31.8182ZM45.4545 0H13.6364C11.1364 0 9.09091 2.04545 9.09091 4.54545V36.3636C9.09091 38.8636 11.1364 40.9091 13.6364 40.9091H45.4545C47.9545 40.9091 50 38.8636 50 36.3636V4.54545C50 2.04545 47.9545 0 45.4545 0ZM45.4545 36.3636H13.6364V4.54545H45.4545V36.3636Z" fill="currentColor"/>
	</svg>`,
	`<svg class="w-full" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.54545 9.09091H0V45.4545C0 47.9545 2.04545 50 4.54545 50H40.9091V45.4545H4.54545V9.09091ZM45.4545 0H13.6364C11.1364 0 9.09091 2.04545 9.09091 4.54545V36.3636C9.09091 38.8636 11.1364 40.9091 13.6364 40.9091H45.4545C47.9545 40.9091 50 38.8636 50 36.3636V4.54545C50 2.04545 47.9545 0 45.4545 0ZM45.4545 36.3636H13.6364V4.54545H45.4545V36.3636ZM36.3636 27.2727H27.2727V22.7273H31.8182C34.3182 22.7273 36.3636 20.7045 36.3636 18.1818V13.6364C36.3636 11.1136 34.3182 9.09091 31.8182 9.09091H22.7273V13.6364H31.8182V18.1818H27.2727C24.7727 18.1818 22.7273 20.2045 22.7273 22.7273V31.8182H36.3636V27.2727Z" fill="currentColor"/>
	</svg>`,
	`<svg class="w-full" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M45.4545 0H13.6364C11.1364 0 9.09091 2.04545 9.09091 4.54545V36.3636C9.09091 38.8636 11.1364 40.9091 13.6364 40.9091H45.4545C47.9545 40.9091 50 38.8636 50 36.3636V4.54545C50 2.04545 47.9545 0 45.4545 0ZM45.4545 36.3636H13.6364V4.54545H45.4545V36.3636ZM4.54545 9.09091H0V45.4545C0 47.9545 2.04545 50 4.54545 50H40.9091V45.4545H4.54545V9.09091ZM36.3636 27.2727V23.8636C36.3636 21.9773 34.8409 20.4545 32.9545 20.4545C34.8409 20.4545 36.3636 18.9318 36.3636 17.0455V13.6364C36.3636 11.1136 34.3182 9.09091 31.8182 9.09091H22.7273V13.6364H31.8182V18.1818H27.2727V22.7273H31.8182V27.2727H22.7273V31.8182H31.8182C34.3182 31.8182 36.3636 29.7955 36.3636 27.2727Z" fill="currentColor"/>
	</svg>`,
	`<svg class="w-full" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.54545 9.09091H0V45.4545C0 47.9545 2.04545 50 4.54545 50H40.9091V45.4545H4.54545V9.09091ZM31.8182 31.8182H36.3636V9.09091H31.8182V18.1818H27.2727V9.09091H22.7273V22.7273H31.8182V31.8182ZM45.4545 0H13.6364C11.1364 0 9.09091 2.04545 9.09091 4.54545V36.3636C9.09091 38.8636 11.1364 40.9091 13.6364 40.9091H45.4545C47.9545 40.9091 50 38.8636 50 36.3636V4.54545C50 2.04545 47.9545 0 45.4545 0ZM45.4545 36.3636H13.6364V4.54545H45.4545V36.3636Z" fill="currentColor"/>
	</svg>`,
]

setCurrentOffice(officeId)

function openCalendar(room: number, place: number) {
	router.push(`/calendar/${room}/${place}`)
}
</script>
