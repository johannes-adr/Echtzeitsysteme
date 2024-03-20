// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userToken?: MyTypes.UserToken
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export namespace MyTypes{
	export interface UserToken{
		id: string,
		username: string,
		password: string
	}

	export type LoginRegisterErrorType = {message: string, type: "sucess" | "error" | "warning"}
}

export {};
