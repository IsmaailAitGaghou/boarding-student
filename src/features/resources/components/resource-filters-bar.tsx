import {
   Box,
   Chip,
   Select,
   MenuItem,
   Typography,
   alpha,
} from "@mui/material";
import { tokens } from "@/app/theme";
import { SearchField } from "@/shared/components/search-field/SearchField";
import { SortSelect } from "@/shared/components/sort-select/SortSelect";
import type {
   ResourceFilters,
   ResourceCategory,
   ResourceType,
   SortOption,
} from "../types";

interface ResourceFiltersBarProps {
   filters: ResourceFilters;
   totalCount: number;
   filteredCount: number;
   onChange: (patch: Partial<ResourceFilters>) => void;
}

const CATEGORY_OPTIONS: ResourceCategory[] = [
   "All",
   "Housing",
   "Integration",
   "Language",
   "Admin",
   "Community",
];

const TYPE_OPTIONS: Array<ResourceType | "All"> = [
   "All",
   "Article",
   "PDF",
   "Link",
   "Checklist",
   "Video",
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
   { value: "recent", label: "Most recent" },
   { value: "popular", label: "Most popular" },
   { value: "az", label: "A–Z" },
];

export function ResourceFiltersBar({
   filters,
   totalCount,
   filteredCount,
   onChange,
}: ResourceFiltersBarProps) {
   const hasActiveFilters =
      filters.category !== "All" ||
      filters.type !== "All" ||
      filters.sort !== "recent";

   return (
      <Box>
         {/* Search + Sort row */}
         <Box
            sx={{
               display: "flex",
               gap: 2,
               alignItems: "center",
               mb: 3,
               flexWrap: "wrap",
            }}
         >
            <SearchField
               placeholder="Search resources by title or topic…"
               value={filters.search ?? ""}
               onChange={(v) => onChange({ search: v })}
            />

            <SortSelect
               options={SORT_OPTIONS}
               value={filters.sort ?? "recent"}
               onChange={(v) => onChange({ sort: v as SortOption })}
            />
         </Box>

         {/* Filter chips row */}
         <Box
            sx={{
               display: "flex",
               gap: 1,
               flexWrap: "wrap",
               alignItems: "center",
            }}
         >
            {/* Category chips */}
            {CATEGORY_OPTIONS.map((cat) => (
               <Chip
                  key={cat}
                  label={cat}
                  onClick={() => onChange({ category: cat })}
                  sx={{
                     fontSize: "0.78rem",
                     fontWeight: 700,
                     height: 28,
                     borderRadius: `${tokens.radius.control}px`,
                     cursor: "pointer",
                     transition: "all 0.15s",
                     ...(filters.category === cat
                        ? {
                             backgroundColor: tokens.color.primary[700],
                             color: "#fff",
                             "&:hover": {
                                backgroundColor: tokens.color.primary[900],
                             },
                          }
                        : {
                             backgroundColor: "transparent",
                             color: tokens.color.text.secondary,
                             border: `1px solid ${tokens.color.border}`,
                             "&:hover": {
                                borderColor: tokens.color.primary[500],
                                backgroundColor: alpha(
                                   tokens.color.primary[700],
                                   0.04,
                                ),
                             },
                          }),
                  }}
               />
            ))}

            {/* Type filter */}
            <Box
               sx={{
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
               }}
            >
               <Typography
                  sx={{
                     fontSize: "0.75rem",
                     color: tokens.color.text.muted,
                     fontWeight: 600,
                  }}
               >
                  Type:
               </Typography>
               <Select
                  value={filters.type ?? "All"}
                  onChange={(e) =>
                     onChange({ type: e.target.value as ResourceType | "All" })
                  }
                  size="small"
                  sx={{
                     minWidth: 120,
                     fontSize: "0.78rem",
                     borderRadius: `${tokens.radius.control}px`,
                     "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: tokens.color.border,
                     },
                     "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: tokens.color.primary[500],
                     },
                  }}
               >
                  {TYPE_OPTIONS.map((type) => (
                     <MenuItem key={type} value={type}>
                        {type}
                     </MenuItem>
                  ))}
               </Select>
            </Box>
         </Box>

         {/* Results count */}
         {hasActiveFilters && (
            <Box
               sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: `1px solid ${tokens.color.border}`,
               }}
            >
               <Typography
                  sx={{
                     fontSize: "0.78rem",
                     color: tokens.color.text.muted,
                     fontWeight: 500,
                  }}
               >
                  Showing {filteredCount} of {totalCount} resources
               </Typography>
            </Box>
         )}
      </Box>
   );
}
