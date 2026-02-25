import { useEffect, useState } from "react";
import { Box, Typography, Alert, Snackbar } from "@mui/material";

import { getProfile, updateProfile, calculateProfileCompletion } from "../api";
import { Loading } from "@/shared/components/loading";
import { ProfileCard } from "../components/profile-card";
import { PersonalInfoSection } from "../components/personal-info-section";
import { SkillsSection } from "../components/skills-section";
import { LanguagesSection } from "../components/languages-section";
import { EducationSection } from "../components/education-section";
import { ExperienceSection } from "../components/experience-section";
import { PreferencesSection } from "../components/preferences-section";
import type { StudentProfile, Education, Experience } from "../types";

export function ProfilePage() {
   const [profile, setProfile] = useState<StudentProfile | null>(null);
   const [editedProfile, setEditedProfile] =
      useState<StudentProfile | null>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isEditMode, setIsEditMode] = useState(false);
   const [successMessage, setSuccessMessage] = useState("");

   const profileCompletion = profile ? calculateProfileCompletion(profile) : 0;

   useEffect(() => {
      loadProfile();
   }, []);

   const loadProfile = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await getProfile();
         setProfile(data);
         setEditedProfile(data);
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Failed to load profile. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   };

   const handleEdit = () => {
      setIsEditMode(true);
      setEditedProfile(profile);
   };

   const handleCancel = () => {
      setIsEditMode(false);
      setEditedProfile(profile);
   };

   const handleSave = async () => {
      if (!editedProfile) return;

      try {
         setSaving(true);
         setError(null);

         const updateData = {
            fullName: editedProfile.fullName,
            email: editedProfile.email,
            phone: editedProfile.phone || "",
            school: editedProfile.school || "",
            country: editedProfile.country || "",
            skills: editedProfile.skills,
            languages: editedProfile.languages,
            education: editedProfile.education,
            experience: editedProfile.experience,
            preferredLocation: editedProfile.preferences?.location || "",
            internshipType: editedProfile.preferences?.internshipType || "",
         };

         const updatedProfile = await updateProfile(updateData);
         setProfile(updatedProfile);
         setEditedProfile(updatedProfile);
         setIsEditMode(false);
         setSuccessMessage("Profile updated successfully!");
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Failed to update profile. Please try again.",
         );
      } finally {
         setSaving(false);
      }
   };

   const handleFieldChange = (field: string, value: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         [field]: value,
      });
   };

   const handlePreferenceChange = (field: string, value: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         preferences: {
            ...editedProfile.preferences,
            [field === "preferredLocation" ? "location" : "internshipType"]:
               value,
         },
      });
   };

   const handleAddSkill = (skill: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         skills: [...editedProfile.skills, skill],
      });
      setSuccessMessage("Skill added successfully!");
   };

   const handleRemoveSkill = (skill: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         skills: editedProfile.skills.filter((s) => s !== skill),
      });
      setSuccessMessage("Skill removed successfully!");
   };

   const handleAddLanguage = (language: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         languages: [...editedProfile.languages, language],
      });
      setSuccessMessage("Language added successfully!");
   };

   const handleRemoveLanguage = (language: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         languages: editedProfile.languages.filter((l) => l !== language),
      });
      setSuccessMessage("Language removed successfully!");
   };

   const handleAddEducation = (education: Education) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         education: [...editedProfile.education, education],
      });
      setSuccessMessage("Education added successfully!");
   };

   const handleUpdateEducation = (id: string, education: Education) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         education: editedProfile.education.map((e) =>
            e.id === id ? education : e,
         ),
      });
      setSuccessMessage("Education updated successfully!");
   };

   const handleRemoveEducation = (id: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         education: editedProfile.education.filter((e) => e.id !== id),
      });
      setSuccessMessage("Education removed successfully!");
   };

   const handleAddExperience = (experience: Experience) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         experience: [...editedProfile.experience, experience],
      });
      setSuccessMessage("Experience added successfully!");
   };

   const handleUpdateExperience = (id: string, experience: Experience) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         experience: editedProfile.experience.map((e) =>
            e.id === id ? experience : e,
         ),
      });
      setSuccessMessage("Experience updated successfully!");
   };

   const handleRemoveExperience = (id: string) => {
      if (!editedProfile) return;

      setEditedProfile({
         ...editedProfile,
         experience: editedProfile.experience.filter((e) => e.id !== id),
      });
      setSuccessMessage("Experience removed successfully!");
   };

   if (loading) {
      return <Loading variant="section" minHeight={400} />;
   }

   if (error && !profile) {
      return (
         <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ maxWidth: 600 }}>
               {error}
            </Alert>
         </Box>
      );
   }

   if (!profile || !editedProfile) {
      return null;
   }

   return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
         {/* Header */}
         <Box
            sx={{
               mb: 4,
            }}
         >
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>
               Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
               Manage your personal information and preferences
            </Typography>
         </Box>

         {error && (
            <Alert
               severity="error"
               sx={{ mb: 3 }}
               onClose={() => setError(null)}
            >
               {error}
            </Alert>
         )}

         {/* 2-Column Layout */}
         <Box
            sx={{
               display: "flex",
               gap: 3,
               flexDirection: { xs: "column", md: "row" },
               alignItems: { xs: "stretch", md: "flex-start" },
            }}
         >
            {/* Left Column - Narrow */}
            <Box
               sx={{
                  flex: { xs: "1 1 100%", md: "0 0 280px" },
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
               }}
            >
               {/* Profile Card */}
               <ProfileCard
                  fullName={profile.fullName}
                  email={profile.email}
                  profileCompletion={profileCompletion}
               />

               {/* Skills */}
               <SkillsSection
                  skills={editedProfile.skills}
                  onAdd={handleAddSkill}
                  onRemove={handleRemoveSkill}
               />

               {/* Languages */}
               <LanguagesSection
                  languages={editedProfile.languages}
                  onAdd={handleAddLanguage}
                  onRemove={handleRemoveLanguage}
               />
            </Box>

            {/* Right Column - Wide */}
            <Box
               sx={{
                  flex: "1 1 auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  minWidth: 0,
               }}
            >
               {/* Personal Info */}
               <PersonalInfoSection
                  fullName={editedProfile.fullName}
                  email={editedProfile.email}
                  phone={editedProfile.phone || ""}
                  school={editedProfile.school || ""}
                  country={editedProfile.country || ""}
                  isEditMode={isEditMode}
                  onChange={handleFieldChange}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  saving={saving}
               />

               {/* Education */}
               <EducationSection
                  education={editedProfile.education}
                  onAdd={handleAddEducation}
                  onUpdate={handleUpdateEducation}
                  onRemove={handleRemoveEducation}
               />

               {/* Experience */}
               <ExperienceSection
                  experience={editedProfile.experience}
                  onAdd={handleAddExperience}
                  onUpdate={handleUpdateExperience}
                  onRemove={handleRemoveExperience}
               />

               {/* Preferences */}
               <PreferencesSection
                  preferredLocation={editedProfile.preferences?.location || ""}
                  internshipType={
                     editedProfile.preferences?.internshipType || ""
                  }
                  isEditMode={isEditMode}
                  onChange={handlePreferenceChange}
               />
            </Box>
         </Box>

         {/* Success Snackbar */}
         <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
         >
            <Alert
               onClose={() => setSuccessMessage("")}
               severity="success"
               sx={{ width: "100%" }}
            >
               {successMessage}
            </Alert>
         </Snackbar>
      </Box>
   );
}
