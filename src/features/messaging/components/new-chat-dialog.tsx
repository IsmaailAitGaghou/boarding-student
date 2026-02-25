import {
   Dialog,
   DialogTitle,
   DialogContent,
   List,
   ListItemButton,
   ListItemAvatar,
   ListItemText,
   Avatar,
   Typography,
   alpha,
   CircularProgress,
   IconButton,
   Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "@/app/theme";
import { getAdvisors } from "@/features/appointments/api";

interface NewChatDialogProps {
   open: boolean;
   starting: boolean;
   onStart: (advisorId: string) => void;
   onClose: () => void;
}

export function NewChatDialog({
   open,
   starting,
   onStart,
   onClose,
}: NewChatDialogProps) {
   // Derive advisors synchronously — no useEffect needed
   const advisors = getAdvisors();

   return (
      <Dialog
         open={open}
         onClose={starting ? undefined : onClose}
         maxWidth="xs"
         fullWidth
         PaperProps={{
            sx: {
               borderRadius: `${tokens.radius.modal}px`,
               boxShadow: tokens.shadow.md,
            },
         }}
      >
         <DialogTitle
            sx={{
               pb: 1,
               pt: 2.5,
               px: 3,
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
            }}
         >
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
               Start a new chat
            </Typography>
            <IconButton
               size="small"
               onClick={onClose}
               disabled={starting}
               sx={{ color: tokens.color.text.muted }}
            >
               <CloseIcon fontSize="small" />
            </IconButton>
         </DialogTitle>

         <DialogContent sx={{ px: 1.5, pb: 2, pt: 0 }}>
            <Typography
               variant="body2"
               sx={{
                  color: tokens.color.text.muted,
                  px: 1.5,
                  pb: 1.5,
                  fontSize: "0.8rem",
               }}
            >
               Select an advisor to start a conversation with.
            </Typography>

            <List disablePadding>
               {advisors.map((advisor) => (
                  <ListItemButton
                     key={advisor.id}
                     disabled={starting}
                     onClick={() => onStart(advisor.id)}
                     sx={{
                        borderRadius: `${tokens.radius.control}px`,
                        mb: 0.5,
                        py: 1.25,
                        "&:hover": {
                           backgroundColor: alpha(
                              tokens.color.primary[700],
                              0.06,
                           ),
                        },
                     }}
                  >
                     <ListItemAvatar sx={{ minWidth: 48 }}>
                        <Avatar
                           sx={{
                              width: 36,
                              height: 36,
                              backgroundColor: alpha(
                                 tokens.color.primary[700],
                                 0.12,
                              ),
                              color: tokens.color.primary[700],
                              fontWeight: 700,
                              fontSize: "0.78rem",
                              borderRadius: `${tokens.radius.control}px`,
                           }}
                        >
                           {advisor.avatarInitials}
                        </Avatar>
                     </ListItemAvatar>
                     <ListItemText
                        primary={
                           <Typography
                              variant="body2"
                              sx={{
                                 fontWeight: 700,
                                 color: tokens.color.text.primary,
                              }}
                           >
                              {advisor.name}
                           </Typography>
                        }
                        secondary={
                           <Typography
                              variant="caption"
                              sx={{
                                 color: tokens.color.text.muted,
                                 fontSize: "0.72rem",
                              }}
                           >
                              {advisor.role}
                           </Typography>
                        }
                        disableTypography
                     />
                     {starting && (
                        <Box sx={{ ml: 1 }}>
                           <CircularProgress
                              size={16}
                              sx={{ color: tokens.color.primary[700] }}
                           />
                        </Box>
                     )}
                  </ListItemButton>
               ))}
            </List>
         </DialogContent>
      </Dialog>
   );
}
