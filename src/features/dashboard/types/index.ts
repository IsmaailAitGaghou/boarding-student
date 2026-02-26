export type DashboardStats = {
	applications: {
		total: number;
		change: number;
		trend: "up" | "down";
	};
	appointments: {
		total: number;
		change: number;
		trend: "up" | "down";
	};
	messages: {
		unread: number;
		change: number;
		trend: "up" | "down";
	};
	progress: {
		percentage: number;
		change: number;
		trend: "up" | "down";
	};
};

export type ActivityItem = {
	id: string;
	type: "match" | "appointment" | "milestone" | "message";
	title: string;
	description: string;
	timestamp: Date;
	icon?: string;
};

export type UpcomingAppointment = {
	id: string;
	advisorName: string;
	advisorRole?: string;
	advisorAvatar?: string;
	purpose: string;
	date: Date;
	duration: number; // minutes
	meetingLink?: string;
	locationOrLink?: string;
	type?: "Online" | "On-site";
};

export type JourneyStage = {
	id: string;
	label: string;
	completed: boolean;
	current: boolean;
};

export type RecommendedMatch = {
	id: string;
	companyName: string;
	position: string;
	matchPercentage: number;
	location: string;
	logo?: string;
	type?: string;
	tags?: string[];
	saved?: boolean;
	status?: string;
};
