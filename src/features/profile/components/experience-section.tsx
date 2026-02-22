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
import WorkIcon from "@mui/icons-material/Work";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { tokens } from "@/app/theme";
import type { Experience } from "../types";

type ExperienceSectionProps = {
   experience: Experience[];
   onAdd: (experience: Experience) => void;
   onUpdate: (id: string, experience: Experience) => void;
   onRemove: (id: string) => void;
};

export function ExperienceSection({
   experience,
   onAdd,
   onUpdate,
   onRemove,
}: ExperienceSectionProps) {
   const [isAdding, setIsAdding] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [menuAnchor, setMenuAnchor] =
      useState<{
         element: HTMLElement;
         expId: string;
      } | null>(null);
   const [formData, setFormData] = useState<Omit<Experience, "id">>({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
   });

   const handleStartAdd = () => {
      setFormData({
         company: "",
         position: "",
         location: "",
         startDate: "",
         endDate: "",
         current: false,
         description: "",
      });
      setIsAdding(true);
      setEditingId(null);
   };

   const handleStartEdit = (exp: Experience) => {
      setFormData({
         company: exp.company,
         position: exp.position,
         location: exp.location || "",
         startDate: exp.startDate,
         endDate: exp.endDate || "",
         current: exp.current,
         description: exp.description || "",
      });
      setEditingId(exp.id);
      setIsAdding(false);
   };

   const handleCancel = () => {
      setIsAdding(false);
      setEditingId(null);
   };

   const handleMenuOpen = (
      event: React.MouseEvent<HTMLElement>,
      expId: string,
   ) => {
      setMenuAnchor({ element: event.currentTarget, expId });
   };

   const handleMenuClose = () => {
      setMenuAnchor(null);
   };

   const handleDeleteMenu = (expId: string) => {
      onRemove(expId);
      handleMenuClose();
   };

   const handleSave = () => {
      if (!formData.company || !formData.position || !formData.startDate)
         return;

      const expData: Experience = {
         id: editingId || `exp-${Date.now()}`,
         ...formData,
         endDate: formData.current ? undefined : formData.endDate,
      };

      if (editingId) {
         onUpdate(editingId, expData);
      } else {
         onAdd(expData);
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
               Experience
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
                        label="Company"
                        value={formData.company}
                        onChange={(e) =>
                           setFormData({ ...formData, company: e.target.value })
                        }
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <TextField
                        fullWidth
                        required
                        size="small"
                        label="Position/Role"
                        value={formData.position}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              position: e.target.value,
                           })
                        }
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <TextField
                        fullWidth
                        size="small"
                        label="Location"
                        value={formData.location}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              location: e.target.value,
                           })
                        }
                        placeholder="e.g., San Francisco, CA"
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
                        label="Currently working here"
                     />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                     <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        label="Description"
                        value={formData.description}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              description: e.target.value,
                           })
                        }
                        placeholder="Describe your responsibilities and achievements..."
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
                              !formData.company ||
                              !formData.position ||
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

         {/* Experience List */}
         {experience.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
               <WorkIcon
                  sx={{ fontSize: 48, color: tokens.color.text.muted, mb: 1 }}
               />
               <Typography variant="body2" color="text.secondary">
                  No experience added yet
               </Typography>
            </Box>
         ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
               {experience.map((exp, index) => (
                  <Box key={exp.id}>
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
                              backgroundColor: tokens.color.success + "20",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                           }}
                        >
                           <WorkIcon sx={{ color: tokens.color.success }} />
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
                                    {exp.position}
                                 </Typography>
                                 <Typography
                                    variant="body2"
                                    color="text.secondary"
                                 >
                                    {exp.company}{" "}
                                    {exp.location && `• ${exp.location}`}
                                 </Typography>
                              </Box>
                              <IconButton
                                 size="small"
                                 onClick={(e) => handleMenuOpen(e, exp.id)}
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
                              {formatDate(exp.startDate)} -{" "}
                              {exp.current
                                 ? "Present"
                                 : formatDate(exp.endDate || "")}
                           </Typography>
                           {exp.description && (
                              <Typography
                                 variant="body2"
                                 color="text.secondary"
                              >
                                 {exp.description}
                              </Typography>
                           )}
                        </Box>
                     </Box>
                     {index < experience.length - 1 && (
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
                     experience.find((e) => e.id === menuAnchor?.expId)!,
                  )
               }
               sx={{ py: 1, fontSize: "0.875rem" }}
            >
               <ListItemIcon sx={{ minWidth: 36 }}>
                  <EditIcon fontSize="small" />
               </ListItemIcon>
               <ListItemText>Edit</ListItemText>
            </MenuItem>

            <MenuItem
               onClick={() => menuAnchor && handleDeleteMenu(menuAnchor.expId)}
               sx={{ py: 1, fontSize: "0.875rem", color: "error.main" }}
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
