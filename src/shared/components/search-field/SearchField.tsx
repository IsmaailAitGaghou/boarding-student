import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "@/app/theme";

interface SearchFieldProps {
   placeholder?: string;
   value: string;
   onChange: (value: string) => void;
   /** Additional flex/width styling for the wrapper. Defaults to flex: "1 1 260px". */
   //    flex?: string;
}

/**
 * Reusable styled search TextField with a leading SearchIcon adornment.
 * Applies the project's standard border/hover/focus token styles.
 */
export function SearchField({
   placeholder = "Search…",
   value,
   onChange,
}: SearchFieldProps) {
   return (
      <TextField
         placeholder={placeholder}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         size="small"
         sx={{
            flex: "1 1 260px",
            "& .MuiOutlinedInput-root": {
               borderRadius: `${tokens.radius.control}px`,
               "& fieldset": { borderColor: tokens.color.border },
               "&:hover fieldset": {
                  borderColor: tokens.color.primary[500],
               },
               "&.Mui-focused fieldset": {
                  borderColor: tokens.color.primary[700],
               },
            },
         }}
         slotProps={{
            input: {
               startAdornment: (
                  <InputAdornment position="start">
                     <SearchIcon
                        sx={{ fontSize: 18, color: tokens.color.text.muted }}
                     />
                  </InputAdornment>
               ),
            },
         }}
      />
   );
}
