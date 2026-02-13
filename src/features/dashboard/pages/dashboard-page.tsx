import { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import { tokens } from "@/app/theme";
import { useAuth } from "@/contexts/auth-context";
import {
   getDashboardStats,
   getRecentActivity,
   getUpcomingAppointments,
   getJourneyProgress,
} from "../api";
import { StatsCard } from "../components/stats-card";
// import { QuickActions } from "../components/quick-actions";
import { ActivityTimeline } from "../components/activity-timeline";
import { AppointmentsWidget } from "../components/appointments-widget";
import { JourneyProgress } from "../components/journey-progress";

import type {
   DashboardStats,
   ActivityItem,
   UpcomingAppointment,
   JourneyStage,
} from "../types";

export function DashboardPage() {
   const { user } = useAuth();

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [stats, setStats] = useState<DashboardStats | null>(null);
   const [activities, setActivities] = useState<ActivityItem[]>([]);
   const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
   const [journey, setJourney] = useState<JourneyStage[]>([]);

   useEffect(() => {
      const loadDashboardData = async () => {
         try {
            setLoading(true);
            setError(null);

            const [statsData, activitiesData, appointmentsData, journeyData] =
               await Promise.all([
                  getDashboardStats(),
                  getRecentActivity(),
                  getUpcomingAppointments(),
                  getJourneyProgress(),
               ]);

            setStats(statsData);
            setActivities(activitiesData);
            setAppointments(appointmentsData);
            setJourney(journeyData);
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
      <Box sx={{ p: 4 }}>
         {/* Header */}
         <Box sx={{ mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>
               Welcome back, {user?.fullName?.split(" ")[0] || "Student"} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
               Here's what's happening with your placement journey today
            </Typography>
         </Box>

         <Grid container spacing={3}>
            {/* Stats Cards */}
            {stats && (
               <>
                  <Grid item xs={12} sm={6} md={3}>
                     <StatsCard
                        title="Applications"
                        value={stats.applications.total}
                        change={stats.applications.change}
                        trend={stats.applications.trend}
                        icon={<AssignmentOutlinedIcon />}
                        color={tokens.color.primary[700]}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                     <StatsCard
                        title="Appointments"
                        value={stats.appointments.total}
                        change={stats.appointments.change}
                        trend={stats.appointments.trend}
                        icon={<CalendarTodayOutlinedIcon />}
                        color={tokens.color.info}
                     />
                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={3}>
							<StatsCard
								title="Unread Messages"
								value={stats.messages.unread}
								change={stats.messages.change}
								trend={stats.messages.trend}
								icon={<MailOutlineIcon />}
								color={tokens.color.warning}
							/>
						</Grid> */}
                  <Grid item xs={6} sm={6} md={3}>
                     <StatsCard
                        title="Journey Progress"
                        value={`${stats.progress.percentage}%`}
                        change={stats.progress.change}
                        trend={stats.progress.trend}
                        icon={<TimelineOutlinedIcon />}
                        color={tokens.color.success}
                     />
                  </Grid>
               </>
            )}
         </Grid>
         <Grid container spacing={3}>
            {/* Quick Actions + Journey Progress */}
            {/* <Grid item xs={12} md={4}>
					<QuickActions />
				</Grid> */}
            <Grid item xs={12} md={8}>
               {journey.length > 0 && <JourneyProgress stages={journey} />}
            </Grid>

            {/* Activity Timeline */}
            <Grid item xs={12} md={7}>
               {activities.length > 0 && (
                  <ActivityTimeline activities={activities} />
               )}
            </Grid>

            {/* Upcoming Appointments */}
            <Grid item xs={12} md={5}>
               {appointments.length > 0 && (
                  <AppointmentsWidget appointments={appointments} />
               )}
            </Grid>
         </Grid>
      </Box>
   );
}
