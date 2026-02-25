import { isMock } from "@/api/env";
import type { StudentProfile, ProfileUpdateRequest } from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mock data for student profile
const mockProfileData: StudentProfile = {
	id: "student-123",
	fullName: "John Smith",
	email: "john.smith@university.edu",
	phone: "+1 (555) 123-4567",
	school: "University of Technology",
	country: "United States",
	skills: [
		"JavaScript",
		"TypeScript",
		"React",
		"Node.js",
		"Python",
		"SQL",
	],
	languages: ["English (Native)", "Spanish (Intermediate)", "French (Basic)"],
	education: [
		{
			id: "edu-1",
			school: "University of Technology",
			degree: "Bachelor of Science",
			fieldOfStudy: "Computer Science",
			startDate: "2021-09",
			endDate: "2025-06",
			current: true,
			description: "Focus on software engineering and artificial intelligence. GPA: 3.8/4.0",
		},
		{
			id: "edu-2",
			school: "Lincoln High School",
			degree: "High School Diploma",
			fieldOfStudy: "Science Track",
			startDate: "2017-09",
			endDate: "2021-06",
			current: false,
			description: "Graduated with honors. President of Computer Science Club.",
		},
	],
	experience: [
		
	],
	preferences: {
		location: "San Francisco, CA",
		internshipType: "Full-time",
	},
	updatedAt: new Date().toISOString(),
};

const mockGetProfile = async (): Promise<StudentProfile> => {
	await sleep(500);
	return mockProfileData;
};

const mockUpdateProfile = async (
	data: ProfileUpdateRequest
): Promise<StudentProfile> => {
	await sleep(600);
	// Simulate updating the profile
	return {
		...mockProfileData,
		...data,
		updatedAt: new Date().toISOString(),
	};
};

export async function getProfile(): Promise<StudentProfile> {
	if (isMock()) return mockGetProfile();
	// TODO: Real API call
	throw new Error("Real API not implemented");
}

export async function updateProfile(
	data: ProfileUpdateRequest
): Promise<StudentProfile> {
	if (isMock()) return mockUpdateProfile(data);
	// TODO: Real API call
	throw new Error("Real API not implemented");
}

// Helper function to calculate profile completion percentage
export function calculateProfileCompletion(profile: StudentProfile): number {
	let completion = 0;

	// Basic info (20%)
	if (profile.fullName && profile.email) completion += 20;

	// Contact (10%)
	if (profile.phone) completion += 10;

	// Education (10%)
	if (profile.school) completion += 5;
	if (profile.country) completion += 5;

	// Skills (15%)
	if (profile.skills && profile.skills.length >= 3) completion += 15;
	else if (profile.skills && profile.skills.length > 0)
		completion += (profile.skills.length / 3) * 15;

	// Languages (10%)
	if (profile.languages && profile.languages.length >= 1) completion += 10;

	// Education entries (15%)
	if (profile.education && profile.education.length >= 1) completion += 15;

	// Experience entries (15%)
	if (profile.experience && profile.experience.length >= 1) completion += 15;

	// Preferences (5%)
	if (profile.preferences?.location) completion += 2.5;
	if (profile.preferences?.internshipType) completion += 2.5;

	return Math.min(100, Math.round(completion));
}

