import { createApiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { isMock } from "@/api/env";

import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockLogin = async (req: LoginRequest): Promise<LoginResponse> => {
	await sleep(700);

	// Simple deterministic mock behavior for UI states.
	if (req.email.toLowerCase().includes("error")) {
		throw new Error("We couldn't sign you in. Please try again.");
	}

	return {
		token: "mock-token",
		user: {
			id: "u_1",
			fullName: "Alex Johnson",
			email: req.email,
		},
	};
};

const mockSignup = async (req: SignupRequest): Promise<SignupResponse> => {
	await sleep(900);

	if (req.email.toLowerCase().includes("taken")) {
		throw new Error("This email is already in use. Try logging in instead.");
	}

	return {
		token: "mock-token",
		user: {
			id: "u_2",
			fullName: req.fullName,
			email: req.email,
		},
	};
};

export async function login(req: LoginRequest): Promise<LoginResponse> {
	if (isMock()) return mockLogin(req);
	const api = createApiClient({ baseUrl: "" });
	return api.request<LoginResponse>(endpoints.auth.login, { method: "POST", json: req });
}

export async function signup(req: SignupRequest): Promise<SignupResponse> {
	if (isMock()) return mockSignup(req);
	const api = createApiClient({ baseUrl: "" });
	return api.request<SignupResponse>(endpoints.auth.signup, { method: "POST", json: req });
}
