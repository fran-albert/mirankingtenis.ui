import { User } from './User';

export interface UserRepository {
	getUser: (id: number) => Promise<User | undefined>;
	getAllUsers: () => Promise<User[]>;
	getTotalUsers: () => Promise<number>;
	createUser: (newUser: User) => Promise<User | undefined>;
}