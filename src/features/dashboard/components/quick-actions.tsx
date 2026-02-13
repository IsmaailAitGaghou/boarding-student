import { Card, Stack, Typography, Button, Grid, Box } from "@mui/material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import { tokens } from "@/app/theme";
import { useNavigate } from "react-router-dom";

type QuickAction = {
   label: string;
   icon: React.ReactElement;
   path: string;
   color: string;
};

const actions: QuickAction[] = [
   {
      label: "Update CV",
      icon: <UploadFileOutlinedIcon />,
      path: "/cv",
      color: tokens.color.primary[700],
   },
   {
      label: "Book Appointment",
      icon: <CalendarTodayOutlinedIcon />,
      path: "/appointments",
      color: tokens.color.info,
   },
   {
      label: "View Matches",
      icon: <PeopleOutlineIcon />,
      path: "/matching",
      color: tokens.color.success,
   },
   {
      label: "Browse Resources",
      icon: <LibraryBooksOutlinedIcon />,
      path: "/resources",
      color: tokens.color.warning,
   },
];

export function QuickActions() {
   const navigate = useNavigate();

   return (
      <Card
         sx={{
            p: 3,
            height: "100%",
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
         <Stack spacing={3}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
               Quick Actions
            </Typography>

            <Grid container spacing={2}>
               {actions.map((action) => (
                  <Grid item xs={6} key={action.label}>
                     <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate(action.path)}
                        sx={{
                           py: 2,
                           flexDirection: "column",
                           gap: 1,
                           borderRadius: 2,
                           borderColor: tokens.color.border,
                           color: tokens.color.text.primary,
                           "&:hover": {
                              borderColor: action.color,
                              backgroundColor: `${action.color}08`,
                           },
                        }}
                     >
                        <Box
                           sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1.5,
                              backgroundColor: `${action.color}15`,
                              color: action.color,
                              display: "grid",
                              placeItems: "center",
                           }}
                        >
                           {action.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                           {action.label}
                        </Typography>
                     </Button>
                  </Grid>
               ))}
            </Grid>
         </Stack>
      </Card>
   );
}
