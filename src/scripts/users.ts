export type User =
	{ [X in 'firstName' | 'lastName' | 'patronymic' | 'phone' | 'mail' | 'imageUrl']: string }
	& { id: number, isAdmin: boolean }


export const users: { [X: string]: User } = {
	'test:test': {
		id: Math.random(),
		isAdmin: true,
		firstName: 'Test name',
		lastName: 'Test surname',
		patronymic: 'Test patronymic',
		mail: 'Test mail',
		phone: '+7 987 654 32 10',
		imageUrl: '',
	},
	
	'cos:cos': {
		id: Math.random(),
		isAdmin: false,
		firstName: 'Иван',
		lastName: 'Косарский',
		patronymic: 'Александрович',
		phone: '+7 922 300 30 08',
		mail: 'cos@gmail.com',
		imageUrl: '/images/man.png',
	},
}

export function getUser(login: string, pass: string) {
	return users[login + ':' + pass]
}
