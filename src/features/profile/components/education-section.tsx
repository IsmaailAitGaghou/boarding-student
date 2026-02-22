import {
   Card,
   Box,
   Typography,
   Button,
   TextField,
   Checkbox,
   FormControlLabel,
   IconButton,
   Grid,
   Divider,
   Menu,
   MenuItem,
   ListItemIcon,
   ListItemText,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { tokens } from "@/app/theme";
import type { Education } from "../types";

type EducationSectionProps = {
   education: Education[];
   onAdd: (education: Education) => void;
   onUpdate: (id: string, education: Education) => void;
   onRemove: (id: string) => void;
};

export function EducationSection({
   education,
   onAdd,
   onUpdate,
   onRemove,
}: EducationSectionProps) {
   const [isAdding, setIsAdding] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [menuAnchor, setMenuAnchor] =
      useState<{
         element: HTMLElement;
         eduId: string;
      } | null>(null);
   const [formData, setFormData] = useState<Omit<Education, "id">>({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
   });

   const handleStartAdd = () => {
      setFormData({
         school: "",
         degree: "",
         fieldOfStudy: "",
         startDate: "",
         endDate: "",
         current: false,
         description: "",
      });
      setIsAdding(true);
      setEditingId(null);
   };

   const handleStartEdit = (edu: Education) => {
      setFormData({
         school: edu.school,
         degree: edu.degree,
         fieldOfStudy: edu.fieldOfStudy,
         startDate: edu.startDate,
         endDate: edu.endDate || "",
         current: edu.current,
         description: edu.description || "",
      });
      setEditingId(edu.id);
      setIsAdding(false);
   };

   const handleCancel = () => {
      setIsAdding(false);
      setEditingId(null);
   };

   const handleMenuOpen = (
      event: React.MouseEvent<HTMLElement>,
      eduId: string,
   ) => {
      setMenuAnchor({ element: event.currentTarget, eduId });
   };

   const handleMenuClose = () => {
      setMenuAnchor(null);
   };

   const handleDeleteMenu = (eduId: string) => {
      onRemove(eduId);
      handleMenuClose();
   };

   const handleSave = () => {
      if (!formData.school || !formData.degree || !formData.startDate) return;

      const eduData: Education = {
         id: editingId || `edu-${Date.now()}`,
         ...formData,
         endDate: formData.current ? undefined : formData.endDate,
      };

      if (editingId) {
         onUpdate(editingId, eduData);
      } else {
         onAdd(eduData);
      }

      handleCancel();
   };

   const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
      });
   };

   return (
      <Card
         sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               mb: 3,
            }}
         >
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
               Education
            </Typography>
            <IconButton
               size="small"
               onClick={handleStartAdd}
               sx={{
                  color: tokens.color.primary[700],
                  "&:hover": {
                     backgroundColor: tokens.color.primary[300] + "10",
                  },
               }}
            >
               <AddIcon fontSize="small" />
            </IconButton>
         </Box>

         {/* Add/Edit Form */}
         {(isAdding || editingId) && (
            <Box
               sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: tokens.color.background,
                  borderRadius: 2,
               }}
            >
               <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <TextField
                        fullWidth
                        required
                        size="small"
                        label="School/University"
                        value={formData.school}
                        onChange={(e) =>
                           setFormData({ ...formData, school: e.target.value })
                        }
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <TextField
                        fullWidth
                        required
                        size="small"
                        label="Degree"
                        value={formData.degree}
                        onChange={(e) =>
                           setFormData({ ...formData, degree: e.target.value })
                        }
                        placeholder="e.g., Bachelor of Science"
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <TextField
                        fullWidth
                        size="small"
                        label="Field of Study"
                        value={formData.fieldOfStudy}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              fieldOfStudy: e.target.value,
                           })
                        }
                        placeholder="e.g., Computer Science"
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <TextField
                        fullWidth
                        required
                        size="small"
                        label="Start Date"
                        type="month"
                        value={formData.startDate}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              startDate: e.target.value,
                           })
                        }
                        InputLabelProps={{ shrink: true }}
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <TextField
                        fullWidth
                        size="small"
                        label="End Date"
                        type="month"
                        value={formData.endDate}
                        onChange={(e) =>
                           setFormData({ ...formData, endDate: e.target.value })
                        }
                        disabled={formData.current}
                        InputLabelProps={{ shrink: true }}
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={formData.current}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    current: e.target.checked,
                                 })
                              }
                           />
                        }
                        label="Currently studying here"
                     />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                     <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        label="Description"
                        value={formData.description}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              description: e.target.value,
                           })
                        }
                        placeholder="Achievements, GPA, relevant coursework..."
                     />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                     <Box
                        sx={{
                           display: "flex",
                           gap: 1,
                           justifyContent: "flex-end",
                        }}
                     >
                        <Button
                           size="small"
                           variant="outlined"
                           startIcon={<CloseIcon />}
                           onClick={handleCancel}
                           sx={{
                              borderColor: tokens.color.border,
                              color: tokens.color.text.secondary,
                           }}
                        >
                           Cancel
                        </Button>
                        <Button
                           size="small"
                           variant="contained"
                           startIcon={<SaveIcon />}
                           onClick={handleSave}
                           disabled={
                              !formData.school ||
                              !formData.degree ||
                              !formData.startDate
                           }
                           sx={{
                              backgroundColor: tokens.color.primary[700],
                              "&:hover": {
                                 backgroundColor: tokens.color.primary[900],
                              },
                           }}
                        >
                           Save
                        </Button>
                     </Box>
                  </Grid>
               </Grid>
            </Box>
         )}

         {/* Education List */}
         {education.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
               <SchoolIcon
                  sx={{ fontSize: 48, color: tokens.color.text.muted, mb: 1 }}
               />
               <Typography variant="body2" color="text.secondary">
                  No education added yet
               </Typography>
            </Box>
         ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
               {education.map((edu, index) => (
                  <Box key={edu.id}>
                     <Box
                        sx={{
                           display: "flex",
                           gap: 2,
                           alignItems: "flex-start",
                        }}
                     >
                        <Box
                           sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: tokens.color.primary[300] + "20",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                           }}
                        >
                           <SchoolIcon
                              sx={{ color: tokens.color.primary[700] }}
                           />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                           <Box
                              sx={{
                                 display: "flex",
                                 justifyContent: "space-between",
                                 alignItems: "flex-start",
                                 mb: 0.5,
                              }}
                           >
                              <Box>
                                 <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 600 }}
                                 >
                                    {edu.degree}{" "}
                                    {edu.fieldOfStudy &&
                                       `in ${edu.fieldOfStudy}`}
                                 </Typography>
                                 <Typography
                                    variant="body2"
                                    color="text.secondary"
                                 >
                                    {edu.school}
                                 </Typography>
                              </Box>
                              <IconButton
                                 size="small"
                                 onClick={(e) => handleMenuOpen(e, edu.id)}
                                 sx={{
                                    color: tokens.color.text.secondary,
                                 }}
                              >
                                 <MoreVertIcon fontSize="small" />
                              </IconButton>
                           </Box>
                           <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 1 }}
                           >
                              {formatDate(edu.startDate)} -{" "}
                              {edu.current
                                 ? "Present"
                                 : formatDate(edu.endDate || "")}
                           </Typography>
                           {edu.description && (
                              <Typography
                                 variant="body2"
                                 color="text.secondary"
                              >
                                 {edu.description}
                              </Typography>
                           )}
                        </Box>
                     </Box>
                     {index < education.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                     )}
                  </Box>
               ))}
            </Box>
         )}

         {/* Context Menu */}
         <Menu
            anchorEl={menuAnchor?.element}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
               sx: {
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: tokens.shadow.md,
               },
            }}
         >
            <MenuItem
               onClick={() =>
                  handleStartEdit(
                     education.find((e) => e.id === menuAnchor?.eduId)!,
                  )
               }
               sx={{ py: 1, fontSize: "0.775rem" }}
            >
               <ListItemIcon sx={{ minWidth: 36 }}>
                  <EditIcon fontSize="small" />
               </ListItemIcon>
               <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
               onClick={() => menuAnchor && handleDeleteMenu(menuAnchor.eduId)}
               sx={{ py: 1, fontSize: "0.775rem", color: "error.main" }}
            >
               <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <DeleteIcon fontSize="small" />
               </ListItemIcon>
               <ListItemText>Delete</ListItemText>
            </MenuItem>
         </Menu>
      </Card>
   );
}
