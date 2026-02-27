import { createApiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { isMock, getApiBaseUrl } from "@/api/env";
import { getJourneyProgress as getJourneyProgressFromJourney } from "@/features/journey/api";
import { getProfile, calculateProfileCompletion } from "@/features/profile/api";
import {
	getAppointments,
} from "@/features/appointments/api";
import {
	getMatches,
} from "@/features/matching/api";
import type {
	DashboardStats,
	ActivityItem,
	UpcomingAppointment,
	JourneyStage,
	RecommendedMatch,
} from "../types";
import type { Appointment } from "@/features/appointments/types";
import type { Match } from "@/features/matching/types";
import { mockDelay } from "@/api/mock-helpers";

const mockGetDashboardStats = async (): Promise<DashboardStats> => {
	await mockDelay(400);
	return {
		applications: {
			total: 12,
			change: 8.2,
			trend: "up",
		},
		appointments: {
			total: 3,
			change: 0,
			trend: "up",
		},
		messages: {
			unread: 5,
			change: 2,
			trend: "up",
		},
		progress: {
			percentage: 68,
			change: 12,
			trend: "up",
		},
	};
};

const mockGetRecentActivity = async (): Promise<ActivityItem[]> => {
	await mockDelay(500);
	return [
		{
			id: "1",
			type: "match",
			title: "New company match",
			description: "TechCorp matched with your profile (92% compatibility)",
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
		},
		{
			id: "2",
			type: "appointment",
			title: "Appointment scheduled",
			description: "Career advisor meeting confirmed for tomorrow at 2:00 PM",
			timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
		},
		{
			id: "3",
			type: "milestone",
			title: "Journey milestone reached",
			description: "Completed CV review and optimization",
			timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
		},
		{
			id: "4",
			type: "message",
			title: "New message received",
			description: "Sarah Johnson sent you a message about your application",
			timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
		},
		{
			id: "5",
			type: "match",
			title: "Company viewed your profile",
			description: "InnovateLabs viewed your profile and CV",
			timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
		},
	];
};

const mockGetUpcomingAppointments = async (): Promise<UpcomingAppointment[]> => {
	// Delegate to the appointments feature — single source of truth.
	const all: Appointment[] = await getAppointments();
	const now = new Date();

	return all
		.filter((a) => a.status === "Scheduled" && new Date(a.dateTime) > now)
		.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
		.slice(0, 3)
		.map((a) => ({
			id: a.id,
			advisorName: a.advisorName,
			advisorRole: a.advisorRole,
			purpose: a.advisorRole,
			date: new Date(a.dateTime),
			duration: a.duration,
			meetingLink: a.type === "Online" ? a.locationOrLink : undefined,
			locationOrLink: a.locationOrLink,
			type: a.type,
		}));
};

const mockGetJourneyProgress = async (): Promise<JourneyStage[]> => {
	
	return getJourneyProgressFromJourney();
};

export async function getDashboardStats(): Promise<DashboardStats> {
	if (isMock()) return mockGetDashboardStats();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<DashboardStats>(endpoints.dashboard.stats, { method: "GET" });
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
	if (isMock()) return mockGetRecentActivity();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<ActivityItem[]>(endpoints.dashboard.recentActivity, { method: "GET" });
}

export async function getUpcomingAppointments(): Promise<UpcomingAppointment[]> {
	if (isMock()) return mockGetUpcomingAppointments();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<UpcomingAppointment[]>(endpoints.dashboard.upcomingAppointments, { method: "GET" });
}

export async function getJourneyProgress(): Promise<JourneyStage[]> {
	if (isMock()) return mockGetJourneyProgress();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<JourneyStage[]>(endpoints.dashboard.journeyProgress, { method: "GET" });
}

const mockGetProfileCompletion = async (): Promise<number> => {
	// Delegated to profile feature — single source of truth.
	// Uses the same calculateProfileCompletion logic as the Profile page.
	const profile = await getProfile();
	return calculateProfileCompletion(profile);
};

export async function getProfileCompletion(): Promise<number> {
	if (isMock()) return mockGetProfileCompletion();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	const res = await api.request<{ percentage: number }>(endpoints.dashboard.profileCompletion, { method: "GET" });
	return res.percentage;
}

const mockGetRecommendedMatches = async (): Promise<RecommendedMatch[]> => {
	// Delegate to the matching feature — single source of truth.
	const all: Match[] = await getMatches({
		search: "",
		location: "",
		industry: "",
		type: "",
		minScore: 0,
		status: "all",
		sort: "score",
	});

	return all
		.filter((m) => !m.applied)
		.sort((a, b) => b.matchScore - a.matchScore)
		.slice(0, 5)
		.map((m) => ({
			id: m.id,
			companyName: m.companyName,
			position: m.role,
			matchPercentage: m.matchScore,
			location: m.location,
			type: m.type,
			tags: m.tags,
			saved: m.saved,
			status: m.status,
		}));
};

export async function getRecommendedMatches(): Promise<RecommendedMatch[]> {
	if (isMock()) return mockGetRecommendedMatches();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<RecommendedMatch[]>(endpoints.dashboard.recommendedMatches, { method: "GET" });
}
