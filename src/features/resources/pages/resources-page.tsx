import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Alert, Button } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { tokens } from "@/app/theme";
import { Loading } from "@/shared/components/loading";
import { ResourceCard } from "../components/resource-card";
import { ResourceDetailsDrawer } from "../components/resource-details-drawer";
import { ResourceFiltersBar } from "../components/resource-filters-bar";
import {
   getResources,
   getResourceById,
   toggleBookmark,
   incrementResourceView,
} from "../api";
import type { Resource, ResourceFilters } from "../types";

const DEFAULT_FILTERS: ResourceFilters = {
   search: "",
   category: "All",
   type: "All",
   sort: "recent",
};

export function ResourcesPage() {
   const [resources, setResources] = useState<Resource[]>([]);
   const [allCount, setAllCount] = useState(0);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [filters, setFilters] = useState<ResourceFilters>(DEFAULT_FILTERS);

   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [selectedResource, setSelectedResource] =
      useState<Resource | null>(null);
   const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

   const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const filtersRef = useRef(filters);
   filtersRef.current = filters;

   const loadResources = useCallback(async (f: ResourceFilters) => {
      setLoading(true);
      setError(null);
      try {
         const data = await getResources(f);
         setResources(data);
         if (f.search === "" && f.category === "All" && f.type === "All") {
            setAllCount(data.length);
         }
      } catch {
         setError("Failed to load resources. Please try again.");
      } finally {
         setLoading(false);
      }
   }, []);

   // Load all count on mount
   useEffect(() => {
      void getResources(DEFAULT_FILTERS).then((data) => {
         setAllCount(data.length);
      });
   }, []);

   // Load resources with debounced search
   useEffect(() => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
         void loadResources(filtersRef.current);
      }, 500);
      return () => {
         if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      };
   }, [filters, loadResources]);

   // Load selected resource details
   useEffect(() => {
      if (!selectedId) {
         setSelectedResource(null);
         return;
      }

      const id = selectedId;
      let mounted = true;

      async function load() {
         try {
            const data = await getResourceById(id);
            if (mounted && data) {
               setSelectedResource(data);
               void incrementResourceView(id);
            }
         } catch (err) {
            console.error("Failed to load resource details:", err);
         }
      }

      void load();

      return () => {
         mounted = false;
      };
   }, [selectedId]);

   // Handlers
   function handleFiltersChange(patch: Partial<ResourceFilters>) {
      setFilters((prev) => ({ ...prev, ...patch }));
   }

   async function handleBookmark(id: string) {
      setBookmarkingId(id);
      try {
         const updated = await toggleBookmark(id);
         setResources((prev) =>
            prev.map((r) =>
               r.id === id ? { ...r, bookmarked: updated.bookmarked } : r,
            ),
         );
         if (selectedResource?.id === id) {
            setSelectedResource({
               ...selectedResource,
               bookmarked: updated.bookmarked,
            });
         }
      } catch (err) {
         console.error("Failed to toggle bookmark:", err);
      } finally {
         setBookmarkingId(null);
      }
   }

   function handleViewDetails(id: string) {
      setSelectedId(id);
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
               Resources Library
            </Typography>
            <Typography
               variant="body2"
               sx={{ color: tokens.color.text.muted, fontWeight: 500 }}
            >
               Guides, documents, and helpful information for your journey
            </Typography>
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
            <ResourceFiltersBar
               filters={filters}
               totalCount={allCount}
               filteredCount={resources.length}
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
                     onClick={() => void loadResources(filters)}
                     sx={{ fontWeight: 700 }}
                  >
                     Retry
                  </Button>
               }
               sx={{ borderRadius: `${tokens.radius.card}px` }}
            >
               {error}
            </Alert>
         ) : resources.length === 0 ? (
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
               <FolderOpenIcon
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
                  No resources found
               </Typography>
               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.muted,
                     textAlign: "center",
                     maxWidth: 360,
                  }}
               >
                  Try adjusting your filters or search query to find what you're
                  looking for.
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
               {resources.map((resource) => (
                  <ResourceCard
                     key={resource.id}
                     resource={resource}
                     onBookmark={handleBookmark}
                     onViewDetails={handleViewDetails}
                     bookmarkingId={bookmarkingId}
                  />
               ))}
            </Box>
         )}

         {/* Details drawer */}
         <ResourceDetailsDrawer
            resource={selectedResource}
            open={selectedId !== null}
            onClose={() => setSelectedId(null)}
            onBookmark={handleBookmark}
            bookmarking={bookmarkingId === selectedResource?.id}
         />
      </Box>
   );
}
