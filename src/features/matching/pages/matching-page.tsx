import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Alert, Button, alpha } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { tokens } from "@/app/theme";
import { Loading } from "@/shared/components/loading";
import {
   getMatches,
   getIndustries,
   getLocations,
   toggleSaveMatch,
   applyToMatch,
} from "../api";
import type { Match, MatchFilters } from "../types";
import { MatchCard } from "../components/match-card";
import { MatchFiltersBar } from "../components/match-filters";
import { MatchDetailsDrawer } from "../components/match-details-drawer";

const DEFAULT_FILTERS: MatchFilters = {
   search: "",
   location: "",
   industry: "",
   type: "",
   minScore: 0,
   status: "all",
   sort: "score",
};

export function MatchingPage() {
   const [matches, setMatches] = useState<Match[]>([]);
   const [allCount, setAllCount] = useState(0);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [filters, setFilters] = useState<MatchFilters>(DEFAULT_FILTERS);
   const [industries, setIndustries] = useState<string[]>([]);
   const [locations, setLocations] = useState<string[]>([]);

   const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
   const [savingId, setSavingId] = useState<string | null>(null);
   const [applyingId, setApplyingId] = useState<string | null>(null);

   const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const filtersRef = useRef(filters);
   filtersRef.current = filters;

   // Load static lists once
   useEffect(() => {
      setIndustries(getIndustries());
      setLocations(getLocations());
   }, []);

   const loadMatches = useCallback(async (f: MatchFilters) => {
      setLoading(true);
      setError(null);
      try {
         const data = await getMatches(f);
         setMatches(data);
         if (
            f.search === "" &&
            f.location === "" &&
            f.industry === "" &&
            f.type === "" &&
            f.minScore === 0 &&
            f.status === "all"
         ) {
            setAllCount(data.length);
         }
      } catch {
         setError("Failed to load matches. Please try again.");
      } finally {
         setLoading(false);
      }
   }, []);


   useEffect(() => {
      void getMatches(DEFAULT_FILTERS).then((data) => {
         setAllCount(data.length);
      });
   }, []);

   
   useEffect(() => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
         void loadMatches(filtersRef.current);
      }, 500);
      return () => {
         if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      };
      
   }, [filters, loadMatches]);

   // Derived data
   const savedCount = matches.filter((m) => m.saved).length;
   const appliedCount = matches.filter((m) => m.applied).length;
   const selectedMatch = matches.find((m) => m.id === selectedMatchId) ?? null;

   // Handlers
   function handleFiltersChange(patch: Partial<MatchFilters>) {
      setFilters((prev) => ({ ...prev, ...patch }));
   }

   async function handleSave(id: string) {
      setSavingId(id);
      try {
         const updated = await toggleSaveMatch(id);
         setMatches((prev) =>
            prev.map((m) => (m.id === id ? { ...m, saved: updated.saved } : m)),
         );
         // sync drawer match if open
      } finally {
         setSavingId(null);
      }
   }

   async function handleApply(id: string) {
      setApplyingId(id);
      try {
         const updated = await applyToMatch(id);
         setMatches((prev) =>
            prev.map((m) =>
               m.id === id
                  ? { ...m, applied: updated.applied, status: updated.status }
                  : m,
            ),
         );
      } finally {
         setApplyingId(null);
      }
   }

   return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
         {/* Page header */}
         <Box sx={{ mb: 3 }}>
            <Typography
               variant="h5"
               sx={{
                  fontWeight: 800,
                  color: tokens.color.text.primary,
                  mb: 0.5,
               }}
            >
               Company Matching
            </Typography>
            <Typography
               variant="body2"
               sx={{ color: tokens.color.text.muted, fontWeight: 500 }}
            >
               Discover companies that match your profile, skills, and career
               goals.
            </Typography>
         </Box>

         {/* Summary chips */}
         <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
            <StatChip
               icon={<TuneIcon sx={{ fontSize: 15 }} />}
               label="Total matches"
               value={allCount}
               color={tokens.color.primary[700]}
            />
            <StatChip
               icon={<BookmarkBorderIcon sx={{ fontSize: 15 }} />}
               label="Saved"
               value={savedCount}
               color={tokens.color.info}
            />
            <StatChip
               icon={<CheckCircleOutlineIcon sx={{ fontSize: 15 }} />}
               label="Applied"
               value={appliedCount}
               color={tokens.color.success}
            />
         </Box>

         {/* Filters */}
         <Box
            sx={{
               border: `1px solid ${tokens.color.border}`,
               borderRadius: `${tokens.radius.card}px`,
               backgroundColor: `${tokens.color.surface}`,
               p: 2.5,
               mb: 3,
            }}
         >
            <MatchFiltersBar
               filters={filters}
               totalCount={allCount}
               filteredCount={matches.length}
               industries={industries}
               locations={locations}
               onChange={handleFiltersChange}
            />
         </Box>

         {/* Content */}
         {loading ? (
            <Loading variant="section" minHeight={400} />
         ) : error ? (
            <Alert
               severity="error"
               action={
                  <Button
                     size="small"
                     onClick={() => void loadMatches(filters)}
                     sx={{ fontWeight: 700 }}
                  >
                     Retry
                  </Button>
               }
               sx={{ borderRadius: `${tokens.radius.card}px` }}
            >
               {error}
            </Alert>
         ) : matches.length === 0 ? (
            <Box
               sx={{
                  border: `1px dashed ${tokens.color.border}`,
                  borderRadius: `${tokens.radius.card}px`,
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
               }}
            >
               <EmojiPeopleIcon
                  sx={{
                     fontSize: 48,
                     color: tokens.color.text.muted,
                     opacity: 0.5,
                  }}
               />
               <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: tokens.color.text.secondary }}
               >
                  No matches found
               </Typography>
               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.muted,
                     textAlign: "center",
                     maxWidth: 360,
                  }}
               >
                  Try adjusting your filters or complete more of your profile to
                  unlock better matches.
               </Typography>
               <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  sx={{
                     mt: 1,
                     borderRadius: `${tokens.radius.control}px`,
                     fontWeight: 700,
                     borderColor: tokens.color.primary[700],
                     color: tokens.color.primary[700],
                  }}
               >
                  Clear all filters
               </Button>
            </Box>
         ) : (
            <Box
               sx={{
                  display: "grid",
                  gridTemplateColumns: {
                     xs: "1fr",
                     sm: "repeat(2, 1fr)",
                     lg: "repeat(3, 1fr)",
                  },
                  gap: 2,
               }}
            >
               {matches.map((match) => (
                  <MatchCard
                     key={match.id}
                     match={match}
                     onSave={handleSave}
                     onApply={handleApply}
                     onViewDetails={(id) => setSelectedMatchId(id)}
                     savingId={savingId}
                     applyingId={applyingId}
                  />
               ))}
            </Box>
         )}

         {/* Details drawer */}
         <MatchDetailsDrawer
            match={selectedMatch}
            open={selectedMatchId !== null}
            onClose={() => setSelectedMatchId(null)}
            onSave={handleSave}
            onApply={handleApply}
            saving={savingId === selectedMatchId}
            applying={applyingId === selectedMatchId}
         />
      </Box>
   );
}

// ── Stat chip helper ────────────────────────────────────────────────────────
function StatChip({
   icon,
   label,
   value,
   color,
}: {
   icon: React.ReactNode;
   label: string;
   value: number;
   color: string;
}) {
   return (
      <Box
         sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.75,
            py: 0.875,
            borderRadius: `${tokens.radius.control}px`,
            border: `1px solid ${alpha(color, 0.25)}`,
            backgroundColor: alpha(color, 0.06),
         }}
      >
         <Box sx={{ color, display: "flex" }}>{icon}</Box>
         <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color }}>
            {value}
         </Typography>
         <Typography
            sx={{ fontSize: "0.78rem", color: tokens.color.text.muted }}
         >
            {label}
         </Typography>
      </Box>
   );
}
