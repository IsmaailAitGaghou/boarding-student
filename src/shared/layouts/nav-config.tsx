import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";

export type NavItem = {
   title: string;
   path: string;
   icon: React.ReactElement;
};

export const navConfig: NavItem[] = [
   {
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardOutlinedIcon />,
   },
   {
      title: "Profile",
      path: "/profile",
      icon: <PersonOutlineIcon />,
   },
   {
      title: "CV",
      path: "/cv",
      icon: <DescriptionOutlinedIcon />,
   },
   {
      title: "Journey",
      path: "/journey",
      icon: <TimelineOutlinedIcon />,
   },
   {
      title: "Matching",
      path: "/matching",
      icon: <PeopleOutlineIcon />,
   },
   {
      title: "Appointments",
      path: "/appointments",
      icon: <CalendarTodayOutlinedIcon />,
   },
   {
      title: "Messaging",
      path: "/messaging",
      icon: <ChatOutlinedIcon />,
   },
   {
      title: "Resources",
      path: "/resources",
      icon: <LibraryBooksOutlinedIcon />,
   },
];
