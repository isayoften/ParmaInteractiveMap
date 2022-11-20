export function getCurrentDay() {
	return +new Date().toISOString().slice(8, 10)
}

export function getCurrentDate() {
	return getNextDate(0)
}

export function getNextDate(days = 1) {
	let day = +new Date().toISOString().slice(8, 10) + days
	
	if (day > 31) day = 31
	
	let strDay = day.toString()
	if (strDay.length < 2)
		strDay = '0' + strDay
	
	return '2022-12-' + strDay
}

export function createDate(day: number) {
	if (day < 1) day = 1
	if (day > 31) day = 31
	
	let strDay = day.toString()
	if (strDay.length < 2)
		strDay = '0' + strDay
	
	return '2022-12-' + strDay
}
export function pickRandom<T>(...args: T[]) {
	const index = Math.floor(Math.random() * args.length)
	return args[index]
}