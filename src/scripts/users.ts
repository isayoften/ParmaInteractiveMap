export type User =
	{ [X in 'firstName' | 'lastName' | 'patronymic' | 'phone' | 'mail' | 'imageUrl']: string } &
	{ id: number, isAdmin: boolean, password: string }

export let users: User[] = [
	{
		id: 0,
		isAdmin: true,
		firstName: 'Test name',
		lastName: 'Test surname',
		patronymic: 'Test patronymic',
		mail: 'test',
		phone: '+7 987 654 32 10',
		imageUrl: '',
		password: 'test',
	},
	{
		id: 1,
		isAdmin: false,
		firstName: 'Иван',
		lastName: 'Косарский',
		patronymic: 'Александрович',
		phone: '+7 922 300 30 08',
		mail: 'cos@gmail.com',
		imageUrl: '/images/man.png',
		password: 'sozikloh',
	},
	{
		id: 2,
		isAdmin: false,
		firstName: 'Дмитрий',
		lastName: 'Леменко',
		patronymic: 'Андреевич',
		phone: '+7 902 647 86 61',
		mail: 'dimalemenko@gmail.com',
		imageUrl: '',
		password: '241003',
	},
	{
		id: 3,
		isAdmin: false,
		firstName: 'Георгий',
		lastName: 'Созинов',
		patronymic: 'Николаевич',
		phone: '+7 912 486 88 91',
		mail: 'sgn-03@mail.ru',
		imageUrl: '/images/man2.png',
		password: 'KosarsiiLoshara',
	},
	{
		id: 4,
		isAdmin: false,
		firstName: 'Даниил',
		lastName: 'Сухой',
		patronymic: 'Владимирович',
		phone: '+7 999 999 99 99',
		mail: 'danikorulezzz@gmail.con',
		imageUrl: '',
		password: 'krabochel',
	},
]

initUsers()

export function getUser(mail: string, pass: string) {
	return users.find(value => value.mail === mail && value.password === pass)
}

export function createUser(user: Omit<User, 'id' | 'imageUrl' | 'isAdmin'>) {
	for (const key in user)
		if (!user[key as keyof typeof user])
			throw `${key} = undefined`
	
	if (getUser(user.mail, user.password))
		throw 'такой аккаунт уже существует'
	
	users.push({
		id: Math.random(),
		isAdmin: false,
		imageUrl: '',
		...user,
	})
	
	saveUsers()
}

function initUsers() {
	if (!localStorage.users) return
	
	users = JSON.parse(localStorage.users)
}

function saveUsers() {
	localStorage.users = JSON.stringify(users)
}
