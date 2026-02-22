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
   Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useAuth } from "@/contexts/auth-context";
import { tokens } from "@/app/theme";
import { navConfig } from "./nav-config";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;
const APPBAR_HEIGHT = 64;

export function DashboardLayout() {
   const navigate = useNavigate();
   const location = useLocation();
   const { user, logout } = useAuth();

   const [mobileOpen, setMobileOpen] = useState(false);
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const [userMenuAnchor, setUserMenuAnchor] =
      useState<null | HTMLElement>(null);

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const handleSidebarToggle = () => {
      setSidebarOpen(!sidebarOpen);
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

   const currentDrawerWidth = sidebarOpen
      ? DRAWER_WIDTH
      : DRAWER_WIDTH_COLLAPSED;

   const drawer = (isCollapsed: boolean) => (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
         {/* Logo */}
         <Box
            sx={{
               p: 1.1,
               display: "flex",
               alignItems: "center",
               justifyContent: isCollapsed ? "center" : "space-between",
               gap: 1.5,
               minHeight: 64,
               position: "relative",
            }}
         >
            {isCollapsed ? (
               <img src="./logo2.png" alt="Logo" width={40} height={40} />
            ) : (
               <img src="./logo.png" alt="Logo" width={150} />
            )}

            {/* Collapse Toggle Button - Desktop Only */}
            <IconButton
               onClick={handleSidebarToggle}
               size="small"
               sx={{
                  display: { xs: "none", md: "flex" },
                  position: "absolute",
                  right: -10,
                  zIndex: 9999,
                  top: 15,
                  color: "text.secondary",
                  width: 28,
                  height: 28,
                  "&:hover": {
                     backgroundColor: alpha(tokens.color.text.secondary, 0.08),
                  },
               }}
            >
               {sidebarOpen ? (
                  <ChevronLeftIcon sx={{ fontSize: 20 }} />
               ) : (
                  <ChevronRightIcon sx={{ fontSize: 20 }} />
               )}
            </IconButton>
         </Box>

         <Divider />

         {/* Navigation */}
         <List sx={{ flex: 1, px: 2, py: 1 }}>
            {navConfig.map((item) => {
               const isActive = location.pathname === item.path;
               const navButton = (
                  <ListItemButton
                     onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                     }}
                     sx={{
                        borderRadius: 1.5,
                        py: 1.25,
                        px: isCollapsed ? 1 : 2,
                        justifyContent: isCollapsed ? "center" : "flex-start",
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
                           minWidth: isCollapsed ? "unset" : 40,
                           color: "inherit",
                        }}
                     >
                        {item.icon}
                     </ListItemIcon>
                     {!isCollapsed && (
                        <ListItemText
                           primary={item.title}
                           primaryTypographyProps={{
                              fontSize: "0.875rem",
                              fontWeight: "inherit",
                           }}
                        />
                     )}
                  </ListItemButton>
               );

               return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                     {isCollapsed ? (
                        <Tooltip title={item.title} placement="right" arrow>
                           {navButton}
                        </Tooltip>
                     ) : (
                        navButton
                     )}
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
                  justifyContent: isCollapsed ? "center" : "flex-start",
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
               {!isCollapsed && (
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
               )}
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
               width: { md: `calc(100% - ${currentDrawerWidth}px)` },
               ml: { md: `${currentDrawerWidth}px` },
               backgroundColor: "background.paper",
               borderBottom: `1px solid ${tokens.color.border}`,
               height: APPBAR_HEIGHT,
               transition:
                  "width 225ms cubic-bezier(0.4, 0, 0.6, 1), margin 225ms cubic-bezier(0.4, 0, 0.6, 1)",
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
                     mr: 2,

                     // collapsed by default
                     width: 44,
                     overflow: "hidden",
                     display: { xs: "none", sm: "block" },

                     transition:
                        "width 220ms ease, background-color 220ms ease",

                     // expand on hover OR while typing (focused)
                     "&:hover, &:focus-within": {
                        width: 300,
                        backgroundColor: alpha(
                           tokens.color.text.secondary,
                           0.06,
                        ),
                        "& .searchInput": {
                           opacity: 1,
                           pointerEvents: "auto",
                        },
                     },
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
                        zIndex: 1,
                     }}
                  >
                     <SearchIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                     />
                  </Box>

                  <InputBase
                     placeholder="Search…"
                     className="searchInput"
                     sx={{
                        width: "100%",
                        color: "text.primary",

                        // hidden unless hover/focus-within
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "opacity 160ms ease",

                        "& .MuiInputBase-input": {
                           padding: "8px 8px 8px 0",
                           paddingLeft: "calc(1em + 32px)",
                           fontSize: "0.875rem",
                        },
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
            sx={{
               width: { md: currentDrawerWidth },
               flexShrink: { md: 0 },
               transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1)",
            }}
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
               {drawer(false)}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
               variant="permanent"
               sx={{
                  display: { xs: "none", md: "block" },
                  "& .MuiDrawer-paper": {
                     boxSizing: "border-box",
                     width: currentDrawerWidth,
                     borderRight: `1px solid ${tokens.color.border}`,
                     transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1)",
                     overflowX: "hidden",
                  },
               }}
               open
            >
               {drawer(!sidebarOpen)}
            </Drawer>
         </Box>

         {/* Main content */}
         <Box
            component="main"
            sx={{
               flexGrow: 1,
               p: 3,
               width: {
                  xs: "100%",
                  md: `calc(100% - ${currentDrawerWidth}px)`,
               },
               mt: `${APPBAR_HEIGHT}px`,
               minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
               backgroundColor: tokens.color.background,
               maxWidth: 1200,
               mx: "auto",
               transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1)",
            }}
         >
            <Outlet />
         </Box>
      </Box>
   );
}
