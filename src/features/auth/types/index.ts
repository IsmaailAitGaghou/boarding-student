import type { User } from "@/types/models";

export type LoginRequest = {
	email: string;
	password: string;
	rememberMe?: boolean;
};

export type LoginResponse = {
	token: string;
	user: User;
};

export type SignupRequest = {
	fullName: string;
	email: string;
	password: string;
};

export type SignupResponse = {
	token: string;
	user: User;
};
