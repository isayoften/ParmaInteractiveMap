import { ref } from 'vue'
import { createDate, pickRandom } from '@/scripts/utils'
import type { User } from '@/scripts/users'
import { users } from '@/scripts/users'

type Floors = (null | User)[][][]

// [date][floor - 1][roomIndex][placeIndex]
export const schedule = ref<{ [X: string]: Floors }>({})

initSchedule()

export function createRoom(floor: number) {
	for (let day = 1; day <= 31; day++)
		schedule.value[createDate(day)][floor - 1].push([null, null, null, null])
	
	saveSchedule()
}

export function removeRoom(floor: number, roomIndex: number) {
	for (let day = 1; day <= 31; day++) {
		delete schedule.value[createDate(day)][floor - 1][roomIndex]
		schedule.value[createDate(day)][floor - 1] = schedule.value[createDate(day)][floor - 1].filter((value: unknown) => value !== undefined)
	}
	
	saveSchedule()
}

function initSchedule() {
	if (sessionStorage.schedule)
		schedule.value = JSON.parse(sessionStorage.schedule)
	else
		for (let i = 1; i <= 31; i++)
			schedule.value[`2022-12-${i.toString().padStart(2, '0')}`] = generateFloors()
	
	saveSchedule()
}

export function saveSchedule() {
	sessionStorage.schedule = JSON.stringify(schedule.value)
}

function generatePlace(): User | null {
	return pickRandom(
		null, null, null, null,
		...Object.values(users))
}

function generateRoom() {
	const arr = []
	
	for (let i = 0; i < 4; i++)
		arr.push(generatePlace())
	
	return arr
}

function generateFloor() {
	const arr = []
	
	const rooms = 5 // pickRandom(2, 3, 4, 5, 6)
	for (let i = 0; i < rooms; i++)
		arr.push(generateRoom())
	
	return arr
}

function generateFloors() {
	const arr = []
	
	for (let i = 0; i < 4; i++)
		arr.push(generateFloor())
	
	return arr
}