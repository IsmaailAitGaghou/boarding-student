import { createApiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { isMock, getApiBaseUrl } from "@/api/env";
import { mockDelay } from "@/api/mock-helpers";

import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "../types";

const mockLogin = async (req: LoginRequest): Promise<LoginResponse> => {
	await mockDelay(700);

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
	await mockDelay(900);

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
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<LoginResponse>(endpoints.auth.login, { method: "POST", json: req });
}

export async function signup(req: SignupRequest): Promise<SignupResponse> {
	if (isMock()) return mockSignup(req);
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<SignupResponse>(endpoints.auth.signup, { method: "POST", json: req });
}
