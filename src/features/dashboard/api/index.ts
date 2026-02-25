import { isMock } from "@/api/env";
import { getJourneyProgress as getJourneyProgressFromJourney } from "@/features/journey/api";
import { getProfile, calculateProfileCompletion } from "@/features/profile/api";
import type {
	DashboardStats,
	ActivityItem,
	UpcomingAppointment,
	JourneyStage,
	RecommendedMatch,
} from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockGetDashboardStats = async (): Promise<DashboardStats> => {
	await sleep(400);
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
	await sleep(500);
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
	await sleep(450);
	return [
		{
			id: "1",
			advisorName: "Dr. Emily Thompson",
			purpose: "Career Strategy Session",
			date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
			duration: 45,
			meetingLink: "https://meet.example.com/abc123",
		},
		{
			id: "2",
			advisorName: "Michael Chen",
			purpose: "CV Review & Optimization",
			date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
			duration: 30,
		},
		{
			id: "3",
			advisorName: "Dr. Sarah Williams",
			purpose: "Interview Preparation",
			date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
			duration: 60,
			meetingLink: "https://meet.example.com/xyz789",
		},
	];
};

const mockGetJourneyProgress = async (): Promise<JourneyStage[]> => {
	
	return getJourneyProgressFromJourney();
};

export async function getDashboardStats(): Promise<DashboardStats> {
	if (isMock()) return mockGetDashboardStats();
	// TODO: Real API call
	throw new Error("Real API not implemented");
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
	if (isMock()) return mockGetRecentActivity();
	// TODO: Real API call
	throw new Error("Real API not implemented");
}

export async function getUpcomingAppointments(): Promise<UpcomingAppointment[]> {
	if (isMock()) return mockGetUpcomingAppointments();
	// TODO: Real API call
	throw new Error("Real API not implemented");
}

export async function getJourneyProgress(): Promise<JourneyStage[]> {
	if (isMock()) return mockGetJourneyProgress();
	// TODO: Real API call
	throw new Error("Real API not implemented");
}

const mockGetProfileCompletion = async (): Promise<number> => {
	// Delegated to profile feature — single source of truth.
	// Uses the same calculateProfileCompletion logic as the Profile page.
	const profile = await getProfile();
	return calculateProfileCompletion(profile);
};

export async function getProfileCompletion(): Promise<number> {
	if (isMock()) return mockGetProfileCompletion();
	// TODO: Real API call
	throw new Error("Real API not implemented");
}

const mockGetRecommendedMatches = async (): Promise<RecommendedMatch[]> => {
	await sleep(500);
	return [
		{
			id: "1",
			companyName: "TechCorp Solutions",
			position: "Software Engineer Intern",
			matchPercentage: 92,
			location: "San Francisco, CA",
		},
		{
			id: "2",
			companyName: "InnovateLabs",
			position: "Product Designer",
			matchPercentage: 88,
			location: "New York, NY",
		},
		{
			id: "3",
			companyName: "DataDrive Inc",
			position: "Data Analyst",
			matchPercentage: 85,
			location: "Austin, TX",
		},
		{
			id: "4",
			companyName: "CloudScale",
			position: "DevOps Engineer",
			matchPercentage: 78,
			location: "Seattle, WA",
		},
		{
			id: "5",
			companyName: "AI Ventures",
			position: "Machine Learning Intern",
			matchPercentage: 72,
			location: "Boston, MA",
		},
	];
};

export async function getRecommendedMatches(): Promise<RecommendedMatch[]> {
	if (isMock()) return mockGetRecommendedMatches();
	// TODO: Real API call
	throw new Error("Real API not implemented");
}
