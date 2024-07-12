import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export function encryptSync(password: string | number): string {
	let salt: string = genSaltSync(10);
	password = (typeof password === 'string') ? password : password.toString();

	return hashSync(password, salt);
};

export function compare(password: string | number, hash: string): boolean {
	password = (typeof password === 'string') ? password : password.toString();
	return compareSync(password, hash);
};