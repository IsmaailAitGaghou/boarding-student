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

type LanguagesSectionProps = {
   languages: string[];
   onAdd: (language: string) => void;
   onRemove: (language: string) => void;
};

export function LanguagesSection({
   languages,
   onAdd,
   onRemove,
}: LanguagesSectionProps) {
   const [newLanguage, setNewLanguage] = useState("");
   const [isAdding, setIsAdding] = useState(false);

   const handleAdd = () => {
      if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
         onAdd(newLanguage.trim());
         setNewLanguage("");
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
               Languages
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
                  placeholder="Add a language (e.g., English (Native))"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
               />
               <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  disabled={!newLanguage.trim()}
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

         {languages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
               No languages added yet
            </Typography>
         ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
               {languages.map((language, index) => (
                  <Chip
                     key={`${language}-${index}`}
                     label={language}
                     onDelete={() => onRemove(language)}
                     sx={{
                        backgroundColor: tokens.color.info + "20",
                        color: tokens.color.info,
                        fontWeight: 500,
                        fontSize: "0.8125rem",
                        "& .MuiChip-deleteIcon": {
                           color: tokens.color.info,
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
