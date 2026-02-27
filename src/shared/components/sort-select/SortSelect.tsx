import { Box, Select, MenuItem } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { tokens } from "@/app/theme";

interface SortOption {
   value: string;
   label: string;
}

interface SortSelectProps {
   options: SortOption[];
   value: string;
   onChange: (value: string) => void;
}

export function SortSelect({ options, value, onChange }: SortSelectProps) {
   return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
         <TuneIcon sx={{ fontSize: 16, color: tokens.color.text.muted }} />
         <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
            {options.map((o) => (
               <MenuItem key={o.value} value={o.value}>
                  {o.label}
               </MenuItem>
            ))}
         </Select>
      </Box>
   );
}
