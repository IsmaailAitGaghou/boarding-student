import { useState } from "react";
import {
   Box,
   Typography,
   Avatar,
   TextField,
   InputAdornment,
   Badge,
   alpha,
   CircularProgress,
   Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import { tokens } from "@/app/theme";
import type { Conversation } from "../types";

interface ConversationListProps {
   conversations: Conversation[];
   selectedId: string | null;
   loading: boolean;
   onSelect: (id: string) => void;
   onNewChat: () => void;
}

function formatRelativeTime(iso: string): string {
   const diff = Date.now() - new Date(iso).getTime();
   const mins = Math.floor(diff / 60_000);
   const hours = Math.floor(diff / 3_600_000);
   const days = Math.floor(diff / 86_400_000);
   if (mins < 1) return "Just now";
   if (mins < 60) return `${mins}m`;
   if (hours < 24) return `${hours}h`;
   if (days < 7) return `${days}d`;
   return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
   });
}

export function ConversationList({
   conversations,
   selectedId,
   loading,
   onSelect,
   onNewChat,
}: ConversationListProps) {
   const [search, setSearch] = useState("");

   const filtered = conversations.filter((c) =>
      c.advisorName.toLowerCase().includes(search.toLowerCase()),
   );

   return (
      <Box
         sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRight: `1px solid ${tokens.color.border}`,
            backgroundColor: tokens.color.surface,
         }}
      >
         {/* Header */}
         <Box
            sx={{
               px: 2,
               pt: 2.5,
               pb: 1.5,
               borderBottom: `1px solid ${tokens.color.border}`,
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               gap: 1,
               flexShrink: 0,
            }}
         >
            <Typography
               variant="subtitle1"
               sx={{ fontWeight: 800, color: tokens.color.text.primary }}
            >
               Messages
            </Typography>
            <Box
               component="button"
               onClick={onNewChat}
               title="Start new chat"
               sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1.5px solid ${tokens.color.border}`,
                  backgroundColor: "transparent",
                  color: tokens.color.primary[700],
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.15s",
                  "&:hover": {
                     backgroundColor: alpha(tokens.color.primary[700], 0.06),
                     borderColor: tokens.color.primary[700],
                  },
               }}
            >
               <AddCommentOutlinedIcon sx={{ fontSize: 16 }} />
            </Box>
         </Box>

         {/* Search */}
         <Box sx={{ px: 2, py: 1.5, flexShrink: 0 }}>
            <TextField
               placeholder="Search advisors…"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               size="small"
               fullWidth
               sx={{
                  "& .MuiOutlinedInput-root": {
                     borderRadius: `${tokens.radius.control}px`,
                     fontSize: "0.82rem",
                     "& fieldset": { borderColor: tokens.color.border },
                     "&:hover fieldset": {
                        borderColor: tokens.color.primary[500],
                     },
                     "&.Mui-focused fieldset": {
                        borderColor: tokens.color.primary[700],
                     },
                  },
               }}
               InputProps={{
                  startAdornment: (
                     <InputAdornment position="start">
                        <SearchIcon
                           sx={{ fontSize: 16, color: tokens.color.text.muted }}
                        />
                     </InputAdornment>
                  ),
               }}
            />
         </Box>

         {/* List */}
         <Box sx={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
               <Box
                  sx={{
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     py: 6,
                  }}
               >
                  <CircularProgress
                     size={28}
                     sx={{ color: tokens.color.primary[700] }}
                  />
               </Box>
            ) : filtered.length === 0 ? (
               <Box
                  sx={{
                     px: 2,
                     py: 6,
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                     gap: 1.5,
                  }}
               >
                  <Typography
                     variant="body2"
                     sx={{
                        color: tokens.color.text.muted,
                        textAlign: "center",
                        fontSize: "0.82rem",
                     }}
                  >
                     {search
                        ? `No advisors matching "${search}"`
                        : "No conversations yet"}
                  </Typography>
                  {!search && (
                     <Button
                        size="small"
                        onClick={onNewChat}
                        sx={{
                           fontWeight: 700,
                           fontSize: "0.78rem",
                           color: tokens.color.primary[700],
                           textTransform: "none",
                        }}
                     >
                        Start a new chat
                     </Button>
                  )}
               </Box>
            ) : (
               filtered.map((conv) => {
                  const isSelected = conv.id === selectedId;
                  return (
                     <Box
                        key={conv.id}
                        onClick={() => onSelect(conv.id)}
                        sx={{
                           px: 2,
                           py: 1.5,
                           display: "flex",
                           gap: 1.5,
                           alignItems: "flex-start",
                           cursor: "pointer",
                           backgroundColor: isSelected
                              ? alpha(tokens.color.primary[700], 0.07)
                              : "transparent",
                           borderLeft: `3px solid ${
                              isSelected
                                 ? tokens.color.primary[700]
                                 : "transparent"
                           }`,
                           transition: "background-color 0.12s",
                           "&:hover": {
                              backgroundColor: isSelected
                                 ? alpha(tokens.color.primary[700], 0.07)
                                 : alpha(tokens.color.primary[700], 0.03),
                           },
                        }}
                     >
                        {/* Avatar */}
                        <Badge
                           badgeContent={conv.unreadCount}
                           color="primary"
                           sx={{
                              "& .MuiBadge-badge": {
                                 backgroundColor: tokens.color.primary[700],
                                 fontSize: "0.65rem",
                                 height: 16,
                                 minWidth: 16,
                                 padding: "0 4px",
                              },
                           }}
                        >
                           <Avatar
                              sx={{
                                 width: 40,
                                 height: 40,
                                 backgroundColor: alpha(
                                    tokens.color.primary[700],
                                    0.12,
                                 ),
                                 color: tokens.color.primary[700],
                                 fontWeight: 700,
                                 fontSize: "0.82rem",
                                 borderRadius: `${tokens.radius.control}px`,
                                 flexShrink: 0,
                              }}
                           >
                              {conv.avatarInitials}
                           </Avatar>
                        </Badge>

                        {/* Text */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                           <Box
                              sx={{
                                 display: "flex",
                                 justifyContent: "space-between",
                                 alignItems: "baseline",
                                 mb: 0.25,
                              }}
                           >
                              <Typography
                                 variant="body2"
                                 sx={{
                                    fontWeight:
                                       conv.unreadCount > 0 ? 700 : 600,
                                    color: tokens.color.text.primary,
                                    fontSize: "0.83rem",
                                 }}
                              >
                                 {conv.advisorName}
                              </Typography>
                              <Typography
                                 variant="caption"
                                 sx={{
                                    color: tokens.color.text.muted,
                                    fontSize: "0.68rem",
                                    flexShrink: 0,
                                    ml: 1,
                                 }}
                              >
                                 {formatRelativeTime(conv.lastMessageAt)}
                              </Typography>
                           </Box>
                           <Typography
                              variant="caption"
                              sx={{
                                 color:
                                    conv.unreadCount > 0
                                       ? tokens.color.text.secondary
                                       : tokens.color.text.muted,
                                 fontWeight: conv.unreadCount > 0 ? 600 : 400,
                                 fontSize: "0.75rem",
                                 display: "block",
                                 overflow: "hidden",
                                 textOverflow: "ellipsis",
                                 whiteSpace: "nowrap",
                              }}
                           >
                              {conv.lastMessage || "No messages yet"}
                           </Typography>
                        </Box>
                     </Box>
                  );
               })
            )}
         </Box>
      </Box>
   );
}
