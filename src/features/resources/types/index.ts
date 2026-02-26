export type ResourceCategory =
   | "All"
   | "Housing"
   | "Integration"
   | "Language"
   | "Admin"
   | "Community";

export type ResourceType = "Article" | "PDF" | "Link" | "Checklist" | "Video";

export type SortOption = "recent" | "popular" | "az";

export interface Resource {
   id: string;
   title: string;
   category: Exclude<ResourceCategory, "All">;
   type: ResourceType;
   description: string;
   /** Full article text — present for "Article" type */
   content?: string;
   /** External URL — present for "Link" type */
   url?: string;
   /** Estimated read/watch time in minutes */
   minutes: number;
   bookmarked: boolean;
   createdAt: string;
   views: number;
}

export interface ResourceFilters {
   search?: string;
   category?: ResourceCategory;
   type?: ResourceType | "All";
   sort?: SortOption;
}

