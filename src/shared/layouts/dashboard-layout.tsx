import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
   Box,
   Drawer,
   AppBar,
   Toolbar,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   IconButton,
   Typography,
   Avatar,
   Menu,
   MenuItem,
   Divider,
   Badge,
   InputBase,
   alpha,
   Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import { useAuth } from "@/contexts/auth-context";
import { tokens } from "@/app/theme";
import { navConfig } from "./nav-config";

const DRAWER_WIDTH = 280;
const APPBAR_HEIGHT = 64;

export function DashboardLayout() {
   const navigate = useNavigate();
   const location = useLocation();
   const { user, logout } = useAuth();

   const [mobileOpen, setMobileOpen] = useState(false);
   const [userMenuAnchor, setUserMenuAnchor] =
      useState<null | HTMLElement>(null);

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setUserMenuAnchor(event.currentTarget);
   };

   const handleUserMenuClose = () => {
      setUserMenuAnchor(null);
   };

   const handleLogout = () => {
      logout();
      navigate("/login");
      handleUserMenuClose();
   };

   const drawer = (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
         {/* Logo */}
         <Box
            sx={{
               p: 3,
               display: "flex",
               alignItems: "center",
               gap: 1.5,
            }}
         >
            <Box
               sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${tokens.color.primary[700]} 0%, ${tokens.color.primary[500]} 100%)`,
                  display: "grid",
                  placeItems: "center",
               }}
            >
               <SchoolOutlinedIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
               Boarding
            </Typography>
         </Box>

         <Divider />

         {/* Navigation */}
         <List sx={{ flex: 1, px: 2, py: 1 }}>
            {navConfig.map((item) => {
               const isActive = location.pathname === item.path;
               return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                     <ListItemButton
                        onClick={() => {
                           navigate(item.path);
                           setMobileOpen(false);
                        }}
                        sx={{
                           borderRadius: 1.5,
                           py: 1.25,
                           px: 2,
                           backgroundColor: isActive
                              ? alpha(tokens.color.primary[700], 0.08)
                              : "transparent",
                           color: isActive
                              ? tokens.color.primary[700]
                              : tokens.color.text.secondary,
                           fontWeight: isActive ? 600 : 400,
                           "&:hover": {
                              backgroundColor: isActive
                                 ? alpha(tokens.color.primary[700], 0.12)
                                 : alpha(tokens.color.text.secondary, 0.04),
                           },
                        }}
                     >
                        <ListItemIcon
                           sx={{
                              minWidth: 40,
                              color: "inherit",
                           }}
                        >
                           {item.icon}
                        </ListItemIcon>
                        <ListItemText
                           primary={item.title}
                           primaryTypographyProps={{
                              fontSize: "0.875rem",
                              fontWeight: "inherit",
                           }}
                        />
                     </ListItemButton>
                  </ListItem>
               );
            })}
         </List>

         <Divider />

         {/* User info at bottom */}
         <Box sx={{ p: 2 }}>
            <Box
               sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: alpha(tokens.color.text.secondary, 0.04),
               }}
            >
               <Avatar
                  sx={{
                     width: 36,
                     height: 36,
                     bgcolor: tokens.color.primary[700],
                     fontSize: "0.875rem",
                     fontWeight: 600,
                  }}
               >
                  {user?.fullName.charAt(0) || "U"}
               </Avatar>
               <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                     variant="body2"
                     sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                     noWrap
                  >
                     {user?.fullName || "User"}
                  </Typography>
                  <Typography
                     variant="caption"
                     color="text.secondary"
                     sx={{ fontSize: "0.6875rem" }}
                     noWrap
                  >
                     {user?.email || "user@example.com"}
                  </Typography>
               </Box>
            </Box>
         </Box>
      </Box>
   );

   return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
         {/* AppBar */}
         <AppBar
            position="fixed"
            elevation={0}
            sx={{
               width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
               ml: { md: `${DRAWER_WIDTH}px` },
               backgroundColor: "background.paper",
               borderBottom: `1px solid ${tokens.color.border}`,
               height: APPBAR_HEIGHT,
            }}
         >
            <Toolbar sx={{ height: APPBAR_HEIGHT }}>
               <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
               >
                  <MenuIcon />
               </IconButton>

               {/* Search */}
               <Box
                  sx={{
                     position: "relative",
                     borderRadius: 2,
                     backgroundColor: alpha(tokens.color.text.secondary, 0.04),
                     "&:hover": {
                        backgroundColor: alpha(
                           tokens.color.text.secondary,
                           0.06,
                        ),
                     },
                     mr: 2,
                     width: { xs: "auto", sm: 300 },
                     display: { xs: "none", sm: "block" },
                  }}
               >
                  <Box
                     sx={{
                        padding: "0 12px",
                        height: "100%",
                        position: "absolute",
                        pointerEvents: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                     }}
                  >
                     <SearchIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                     />
                  </Box>
                  <InputBase
                     placeholder="Search…"
                     sx={{
                        width: "100%",
                        "& .MuiInputBase-input": {
                           padding: "8px 8px 8px 0",
                           paddingLeft: "calc(1em + 32px)",
                           fontSize: "0.875rem",
                        },
                        color: "text.primary",
                     }}
                  />
               </Box>

               <Box sx={{ flexGrow: 1 }} />

               {/* Right side icons */}
               <Stack direction="row" spacing={1}>
                  <IconButton size="small" sx={{ color: "text.primary" }}>
                     <Badge badgeContent={3} color="error">
                        <NotificationsOutlinedIcon fontSize="small" />
                     </Badge>
                  </IconButton>

                  <IconButton
                     onClick={handleUserMenuOpen}
                     size="small"
                     sx={{
                        ml: 1,
                        display: "flex",
                        gap: 1,
                        borderRadius: 2,
                        px: 1,
                        "&:hover": {
                           backgroundColor: alpha(
                              tokens.color.text.secondary,
                              0.04,
                           ),
                        },
                     }}
                  >
                     <Avatar
                        sx={{
                           width: 32,
                           height: 32,
                           bgcolor: tokens.color.primary[700],
                           fontSize: "0.75rem",
                        }}
                     >
                        {user?.fullName.charAt(0) || "U"}
                     </Avatar>
                     <KeyboardArrowDownIcon
                        sx={{
                           color: "text.secondary",
                           display: { xs: "none", sm: "block" },
                        }}
                     />
                  </IconButton>
               </Stack>

               {/* User menu */}
               <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                     sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: tokens.shadow.md,
                     },
                  }}
               >
                  <Box sx={{ px: 2, py: 1.5 }}>
                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user?.fullName || "User"}
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                        {user?.email || "user@example.com"}
                     </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                     onClick={() => {
                        navigate("/app/profile");
                        handleUserMenuClose();
                     }}
                     sx={{ py: 1, fontSize: "0.875rem" }}
                  >
                     <PersonOutlineIcon fontSize="small" sx={{ mr: 1.5 }} />
                     Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                     onClick={handleLogout}
                     sx={{ py: 1, fontSize: "0.875rem", color: "error.main" }}
                  >
                     <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} />
                     Logout
                  </MenuItem>
               </Menu>
            </Toolbar>
         </AppBar>

         {/* Drawer */}
         <Box
            component="nav"
            sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
         >
            {/* Mobile drawer */}
            <Drawer
               variant="temporary"
               open={mobileOpen}
               onClose={handleDrawerToggle}
               ModalProps={{ keepMounted: true }}
               sx={{
                  display: { xs: "block", md: "none" },
                  "& .MuiDrawer-paper": {
                     boxSizing: "border-box",
                     width: DRAWER_WIDTH,
                     borderRight: `1px solid ${tokens.color.border}`,
                  },
               }}
            >
               {drawer}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
               variant="permanent"
               sx={{
                  display: { xs: "none", md: "block" },
                  "& .MuiDrawer-paper": {
                     boxSizing: "border-box",
                     width: DRAWER_WIDTH,
                     borderRight: `1px solid ${tokens.color.border}`,
                  },
               }}
               open
            >
               {drawer}
            </Drawer>
         </Box>

         {/* Main content */}
         <Box
            component="main"
            sx={{
               flexGrow: 1,
               p: 3,
               width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
               mt: `${APPBAR_HEIGHT}px`,
               minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
               backgroundColor: tokens.color.background,
            }}
         >
            <Outlet />
         </Box>
      </Box>
   );
}
