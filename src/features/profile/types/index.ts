import type { StudentProfile, Education, Experience } from "@/types/models";

export type ProfileFormData = {
	fullName: string;
	email: string;
	phone: string;
	school: string;
	country: string;
	skills: string[];
	languages: string[];
	education: Education[];
	experience: Experience[];
	preferredLocation: string;
	internshipType: string;
};

export type ProfileUpdateRequest = Partial<ProfileFormData>;

export type { StudentProfile, Education, Experience };

