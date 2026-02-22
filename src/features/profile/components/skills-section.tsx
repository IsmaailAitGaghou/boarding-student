import {
   Card,
   Box,
   Typography,
   Chip,
   TextField,
   Button,
   Stack,
   IconButton,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { tokens } from "@/app/theme";

type SkillsSectionProps = {
   skills: string[];
   onAdd: (skill: string) => void;
   onRemove: (skill: string) => void;
};

export function SkillsSection({ skills, onAdd, onRemove }: SkillsSectionProps) {
   const [newSkill, setNewSkill] = useState("");
   const [isAdding, setIsAdding] = useState(false);

   const handleAdd = () => {
      if (newSkill.trim() && !skills.includes(newSkill.trim())) {
         onAdd(newSkill.trim());
         setNewSkill("");
         setIsAdding(false);
      }
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
         e.preventDefault();
         handleAdd();
      }
   };

   return (
      <Card
         sx={{
            p: 3,
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
               Skills
            </Typography>
            <IconButton
               size="small"
               onClick={() => setIsAdding(!isAdding)}
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

         {isAdding && (
            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
               <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a skill (e.g., JavaScript, Python)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
               />
               <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  disabled={!newSkill.trim()}
                  sx={{
                     minWidth: "100px",
                     borderColor: tokens.color.border,
                     color: tokens.color.text.primary,
                     "&:hover": {
                        borderColor: tokens.color.primary[700],
                        backgroundColor: tokens.color.primary[300] + "10",
                     },
                  }}
               >
                  Add
               </Button>
            </Box>
         )}

         {skills.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
               No skills added yet
            </Typography>
         ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
               {skills.map((skill, index) => (
                  <Chip
                     key={`${skill}-${index}`}
                     label={skill}
                     onDelete={() => onRemove(skill)}
                     sx={{
                        backgroundColor: tokens.color.primary[300] + "20",
                        color: tokens.color.primary[700],
                        fontWeight: 500,
                        fontSize: "0.8125rem",
                        "& .MuiChip-deleteIcon": {
                           color: tokens.color.primary[700],
                           "&:hover": {
                              color: tokens.color.primary[900],
                           },
                        },
                     }}
                  />
               ))}
            </Stack>
         )}
      </Card>
   );
}
