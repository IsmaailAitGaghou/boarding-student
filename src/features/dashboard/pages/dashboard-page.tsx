import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import { tokens } from "@/app/theme";
import { useAuth } from "@/contexts/auth-context";
import {
   getDashboardStats,
   getUpcomingAppointments,
   getJourneyProgress,
   getProfileCompletion,
   getRecommendedMatches,
} from "../api";
import { StatsCard } from "../components/stats-card";
import { JourneyProgress } from "../components/journey-progress";
import { ProfileCompletion } from "../components/profile-completion";
import { NextAppointment } from "../components/next-appointment";
import { RecommendedMatches } from "../components/recommended-matches";

import type {
   DashboardStats,
   UpcomingAppointment,
   JourneyStage,
   RecommendedMatch,
} from "../types";

export function DashboardPage() {
   const { user } = useAuth();

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [stats, setStats] = useState<DashboardStats | null>(null);
   const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
   const [journey, setJourney] = useState<JourneyStage[]>([]);
   const [profileCompletion, setProfileCompletion] = useState<number>(0);
   const [matches, setMatches] = useState<RecommendedMatch[]>([]);

   useEffect(() => {
      const loadDashboardData = async () => {
         try {
            setLoading(true);
            setError(null);

            const [
               statsData,
               appointmentsData,
               journeyData,
               profileData,
               matchesData,
            ] = await Promise.all([
               getDashboardStats(),
               getUpcomingAppointments(),
               getJourneyProgress(),
               getProfileCompletion(),
               getRecommendedMatches(),
            ]);

            setStats(statsData);
            setAppointments(appointmentsData);
            setJourney(journeyData);
            setProfileCompletion(profileData);
            setMatches(matchesData);
         } catch (e) {
            setError(
               e instanceof Error
                  ? e.message
                  : "Failed to load dashboard data. Please try again.",
            );
         } finally {
            setLoading(false);
         }
      };

      loadDashboardData();
   }, []);

   if (loading) {
      return (
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               minHeight: 400,
            }}
         >
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
         </Alert>
      );
   }

   return (
      <Box sx={{ p: 3 }}>
         {/* Header */}
         <Box sx={{ mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>
               Welcome back, {user?.fullName?.split(" ")[0] || "Student"} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
               Here's what's happening with your placement journey today
            </Typography>
         </Box>

         {/* Profile Completion - Only shows if not 100% */}
         <ProfileCompletion percentage={profileCompletion} />

         {/* Stats Cards Row - 3 Cards Side by Side */}
         <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            {stats && (
               <>
                  <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
                     <StatsCard
                        title="Applications"
                        value={stats.applications.total}
                        change={stats.applications.change}
                        trend={stats.applications.trend}
                        icon={<AssignmentOutlinedIcon />}
                        color={tokens.color.primary[700]}
                        chartData={[10, 41, 35, 51, 49, 62, 69, 91, 148]}
                     />
                  </Box>
                  <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
                     <StatsCard
                        title="Appointments"
                        value={stats.appointments.total}
                        change={stats.appointments.change}
                        trend={stats.appointments.trend}
                        icon={<CalendarTodayOutlinedIcon />}
                        color={tokens.color.info}
                        chartData={[22, 8, 35, 50, 82, 84, 77, 12, 87]}
                     />
                  </Box>
                  <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
                     <StatsCard
                        title="Journey progress"
                        value={`${stats.progress.percentage}%`}
                        change={stats.progress.change}
                        trend={stats.progress.trend}
                        icon={<TimelineOutlinedIcon />}
                        color={tokens.color.success}
                        chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11]}
                     />
                  </Box>
               </>
            )}
         </Box>

         {/* Your Journey Progress and Upcoming Appointments Row */}
         <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            <Box sx={{ flex: "2 1 600px", minWidth: 0 }}>
               {journey.length > 0 && <JourneyProgress stages={journey} />}
            </Box>
            <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
               <NextAppointment appointment={appointments[0] || null} />
            </Box>
         </Box>

         {/* Recommended Matches - Full Width */}
         {matches.length > 0 && (
            <Box sx={{ mb: 3 }}>
               <RecommendedMatches matches={matches} />
            </Box>
         )}
      </Box>
   );
}
