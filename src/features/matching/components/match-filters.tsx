import {
   Box,
   TextField,
   InputAdornment,
   Chip,
   Select,
   MenuItem,
   Typography,
   alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { tokens } from "@/app/theme";
import type { MatchFilters, MatchType } from "../types";

interface MatchFiltersBarProps {
   filters: MatchFilters;
   totalCount: number;
   filteredCount: number;
   industries: string[];
   locations: string[];
   onChange: (patch: Partial<MatchFilters>) => void;
}

const SCORE_OPTIONS: { value: number; label: string }[] = [
   { value: 0, label: "All scores" },
   { value: 60, label: "60%+" },
   { value: 75, label: "75%+" },
   { value: 85, label: "85%+" },
];

const TYPE_OPTIONS: { value: MatchType | ""; label: string }[] = [
   { value: "", label: "All types" },
   { value: "Internship", label: "Internship" },
   { value: "Apprenticeship", label: "Apprenticeship" },
   { value: "Part-time", label: "Part-time" },
   { value: "Full-time", label: "Full-time" },
];

const STATUS_OPTIONS: { value: MatchFilters["status"]; label: string }[] = [
   { value: "all", label: "All" },
   { value: "saved", label: "Saved" },
   { value: "applied", label: "Applied" },
];

const SORT_OPTIONS = [
   { value: "score", label: "Highest match" },
   { value: "recent", label: "Most recent" },
   { value: "location", label: "Location A–Z" },
] as const;

export function MatchFiltersBar({
   filters,
   totalCount,
   filteredCount,
   industries,
   locations,
   onChange,
}: MatchFiltersBarProps) {
   const hasActiveFilters =
      filters.location !== "" ||
      filters.industry !== "" ||
      filters.type !== "" ||
      filters.minScore !== 0 ||
      filters.status !== "all";

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
            <TextField
               placeholder="Search company, role, or skill…"
               value={filters.search}
               onChange={(e) => onChange({ search: e.target.value })}
               size="small"
               sx={{
                  flex: "1 1 260px",
                  "& .MuiOutlinedInput-root": {
                     borderRadius: `${tokens.radius.control}px`,
                     "& fieldset": { borderColor: tokens.color.border },
                     "&:hover fieldset": {
                        borderColor: tokens.color.primary[500],
                     },
                     "&.Mui-focused fieldset": {
                        borderColor: tokens.color.primary[700],
                     },
                  },
               }}
               InputProps={{
                  startAdornment: (
                     <InputAdornment position="start">
                        <SearchIcon
                           sx={{ fontSize: 18, color: tokens.color.text.muted }}
                        />
                     </InputAdornment>
                  ),
               }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <TuneIcon
                  sx={{ fontSize: 16, color: tokens.color.text.muted }}
               />
               <Select
                  value={filters.sort}
                  onChange={(e) =>
                     onChange({ sort: e.target.value as MatchFilters["sort"] })
                  }
                  size="small"
                  sx={{
                     minWidth: 160,
                     borderRadius: `${tokens.radius.control}px`,
                     "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: tokens.color.border,
                     },
                     "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: tokens.color.primary[500],
                     },
                  }}
               >
                  {SORT_OPTIONS.map((o) => (
                     <MenuItem key={o.value} value={o.value}>
                        {o.label}
                     </MenuItem>
                  ))}
               </Select>
            </Box>
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
            {/* Status */}
            {STATUS_OPTIONS.map((s) => (
               <Chip
                  key={s.value}
                  label={s.label}
                  size="small"
                  onClick={() => onChange({ status: s.value })}
                  sx={{
                     fontWeight: 600,
                     fontSize: "0.75rem",
                     borderRadius: `${tokens.radius.control}px`,
                     cursor: "pointer",
                     backgroundColor:
                        filters.status === s.value
                           ? tokens.color.primary[700]
                           : alpha(tokens.color.text.muted, 0.08),
                     color:
                        filters.status === s.value
                           ? "#fff"
                           : tokens.color.text.secondary,
                     border: `1px solid ${
                        filters.status === s.value
                           ? tokens.color.primary[700]
                           : tokens.color.border
                     }`,
                     "&:hover": {
                        backgroundColor:
                           filters.status === s.value
                              ? tokens.color.primary[900]
                              : alpha(tokens.color.primary[700], 0.08),
                     },
                  }}
               />
            ))}

            <Box
               sx={{
                  width: 1,
                  height: 1.3,
                  my: 1,
                  backgroundColor: tokens.color.border,
                  mx: 0.5,
               }}
            />

            {/* Type */}
            {TYPE_OPTIONS.filter((t) => t.value !== "").map((t) => (
               <Chip
                  key={t.value}
                  label={t.label}
                  size="small"
                  onClick={() =>
                     onChange({
                        type:
                           filters.type === t.value
                              ? ""
                              : (t.value as MatchType),
                     })
                  }
                  sx={{
                     fontWeight: 600,
                     fontSize: "0.75rem",
                     borderRadius: `${tokens.radius.control}px`,
                     cursor: "pointer",
                     backgroundColor:
                        filters.type === t.value
                           ? alpha(tokens.color.primary[700], 0.1)
                           : "transparent",
                     color:
                        filters.type === t.value
                           ? tokens.color.primary[700]
                           : tokens.color.text.muted,
                     border: `1px solid ${
                        filters.type === t.value
                           ? tokens.color.primary[700]
                           : tokens.color.border
                     }`,
                     "&:hover": {
                        backgroundColor: alpha(tokens.color.primary[700], 0.06),
                        borderColor: tokens.color.primary[500],
                        color: tokens.color.primary[700],
                     },
                  }}
               />
            ))}

            <Box
               sx={{
                  width: 1,
                  height: 1.3,
                  my: 1,
                  backgroundColor: tokens.color.border,
                  mx: 0.5,
               }}
            />

            {/* Min score */}
            {SCORE_OPTIONS.filter((s) => s.value > 0).map((s) => (
               <Chip
                  key={s.value}
                  label={s.label}
                  size="small"
                  onClick={() =>
                     onChange({
                        minScore: filters.minScore === s.value ? 0 : s.value,
                     })
                  }
                  sx={{
                     fontWeight: 600,
                     fontSize: "0.75rem",
                     borderRadius: `${tokens.radius.control}px`,
                     cursor: "pointer",
                     backgroundColor:
                        filters.minScore === s.value
                           ? alpha(tokens.color.success, 0.1)
                           : "transparent",
                     color:
                        filters.minScore === s.value
                           ? tokens.color.success
                           : tokens.color.text.muted,
                     border: `1px solid ${
                        filters.minScore === s.value
                           ? tokens.color.success
                           : tokens.color.border
                     }`,
                     "&:hover": {
                        backgroundColor: alpha(tokens.color.success, 0.06),
                        borderColor: tokens.color.success,
                        color: tokens.color.success,
                     },
                  }}
               />
            ))}

            {/* Location select */}
            <Select
               value={filters.location}
               onChange={(e) => onChange({ location: e.target.value })}
               displayEmpty
               size="small"
               sx={{
                  minWidth: 130,
                  borderRadius: `${tokens.radius.control}px`,
                  fontSize: "0.75rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                     borderColor: filters.location
                        ? tokens.color.primary[700]
                        : tokens.color.border,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                     borderColor: tokens.color.primary[500],
                  },
               }}
            >
               <MenuItem value="">All locations</MenuItem>
               {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                     {loc}
                  </MenuItem>
               ))}
            </Select>

            <Box
               sx={{
                  width: 1,
                  height: 1.3,
                  my: 1,
                  backgroundColor: tokens.color.border,
                  mx: 0.5,
               }}
            />

            {/* Industry chips */}
            {industries.slice(0, 4).map((ind) => (
               <Chip
                  key={ind}
                  label={ind}
                  size="small"
                  onClick={() =>
                     onChange({
                        industry: filters.industry === ind ? "" : ind,
                     })
                  }
                  sx={{
                     fontWeight: 600,
                     fontSize: "0.75rem",
                     borderRadius: `${tokens.radius.control}px`,
                     cursor: "pointer",
                     backgroundColor:
                        filters.industry === ind
                           ? alpha(tokens.color.info, 0.1)
                           : "transparent",
                     color:
                        filters.industry === ind
                           ? tokens.color.info
                           : tokens.color.text.muted,
                     border: `1px solid ${
                        filters.industry === ind
                           ? tokens.color.info
                           : tokens.color.border
                     }`,
                     "&:hover": {
                        backgroundColor: alpha(tokens.color.info, 0.06),
                        borderColor: tokens.color.info,
                        color: tokens.color.info,
                     },
                  }}
               />
            ))}

            {/* Clear filters */}
            {hasActiveFilters && (
               <Chip
                  label="Clear filters"
                  size="small"
                  onClick={() =>
                     onChange({
                        location: "",
                        industry: "",
                        type: "",
                        minScore: 0,
                        status: "all",
                     })
                  }
                  sx={{
                     fontWeight: 600,
                     fontSize: "0.75rem",
                     borderRadius: `${tokens.radius.control}px`,
                     cursor: "pointer",
                     color: tokens.color.error,
                     border: `1px solid ${tokens.color.error}`,
                     backgroundColor: alpha(tokens.color.error, 0.04),
                     "&:hover": {
                        backgroundColor: alpha(tokens.color.error, 0.08),
                     },
                  }}
               />
            )}
         </Box>

         {/* Results count */}
         <Typography
            variant="caption"
            sx={{
               mt: 1.5,
               display: "block",
               color: tokens.color.text.muted,
               fontWeight: 500,
            }}
         >
            Showing {filteredCount} of {totalCount} matches
         </Typography>
      </Box>
   );
}
