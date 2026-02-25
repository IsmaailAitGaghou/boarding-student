import { useState, useRef, useEffect } from "react";
import {
   Box,
   Typography,
   Avatar,
   TextField,
   IconButton,
   CircularProgress,
   alpha,
   Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/app/theme";
import { Loading } from "@/shared/components/loading";
import type { Conversation, Message } from "../types";

interface ChatWindowProps {
   conversation: Conversation | null;
   messages: Message[];
   loadingMessages: boolean;
   sending: boolean;
   onSend: (text: string) => Promise<void>;
   onBack?: () => void;
   showBack?: boolean;
}

function formatMessageTime(iso: string): string {
   const d = new Date(iso);
   return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDateGroup(iso: string): string {
   const d = new Date(iso);
   const today = new Date();
   const yesterday = new Date(today);
   yesterday.setDate(yesterday.getDate() - 1);

   if (d.toDateString() === today.toDateString()) return "Today";
   if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
   return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
   });
}

/** Group messages by calendar day */
function groupByDay(messages: Message[]): { date: string; msgs: Message[] }[] {
   const groups: { date: string; msgs: Message[] }[] = [];
   for (const msg of messages) {
      const label = formatDateGroup(msg.createdAt);
      const last = groups[groups.length - 1];
      if (last && last.date === label) {
         last.msgs.push(msg);
      } else {
         groups.push({ date: label, msgs: [msg] });
      }
   }
   return groups;
}

export function ChatWindow({
   conversation,
   messages,
   loadingMessages,
   sending,
   onSend,
   onBack,
   showBack,
}: ChatWindowProps) {
   const [text, setText] = useState("");
   const bottomRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const navigate = useNavigate();

   // Scroll to bottom when messages change
   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   // Focus input when conversation changes
   useEffect(() => {
      if (conversation) inputRef.current?.focus();
   }, [conversation?.id]); // eslint-disable-line react-hooks/exhaustive-deps

   async function handleSend() {
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      setText("");
      await onSend(trimmed);
   }

   function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         void handleSend();
      }
   }

   // ── Empty / no conversation selected ──────────────────────────────────────
   if (!conversation) {
      return (
         <Box
            sx={{
               flex: 1,
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               justifyContent: "center",
               gap: 1.5,
               backgroundColor: tokens.color.background,
            }}
         >
            <Box
               sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: alpha(tokens.color.primary[700], 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               <SendIcon
                  sx={{ fontSize: 24, color: tokens.color.primary[700] }}
               />
            </Box>
            <Typography
               variant="subtitle1"
               sx={{ fontWeight: 700, color: tokens.color.text.secondary }}
            >
               Select a conversation
            </Typography>
            <Typography
               variant="body2"
               sx={{
                  color: tokens.color.text.muted,
                  textAlign: "center",
                  maxWidth: 280,
               }}
            >
               Choose an advisor from the list to start messaging.
            </Typography>
         </Box>
      );
   }

   const groups = groupByDay(messages);

   return (
      <Box
         sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: tokens.color.surface,
         }}
      >
         {/* Chat header */}
         <Box
            sx={{
               px: 2,
               py: 1.5,
               borderBottom: `1px solid ${tokens.color.border}`,
               display: "flex",
               alignItems: "center",
               gap: 1.5,
               flexShrink: 0,
               backgroundColor: tokens.color.surface,
            }}
         >
            {showBack && (
               <IconButton
                  size="small"
                  onClick={onBack}
                  sx={{ color: tokens.color.text.muted, mr: 0.5 }}
               >
                  <ArrowBackIcon fontSize="small" />
               </IconButton>
            )}

            <Avatar
               sx={{
                  width: 38,
                  height: 38,
                  backgroundColor: alpha(tokens.color.primary[700], 0.12),
                  color: tokens.color.primary[700],
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  borderRadius: `${tokens.radius.control}px`,
                  flexShrink: 0,
               }}
            >
               {conversation.avatarInitials}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
               <Typography
                  variant="body2"
                  sx={{
                     fontWeight: 700,
                     color: tokens.color.text.primary,
                     lineHeight: 1.3,
                  }}
               >
                  {conversation.advisorName}
               </Typography>
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.muted, fontSize: "0.72rem" }}
               >
                  {conversation.advisorRole}
               </Typography>
            </Box>

            {/* Book appointment shortcut */}
            <Tooltip title="Book appointment with this advisor">
               <IconButton
                  size="small"
                  onClick={() => navigate("/appointments")}
                  sx={{
                     color: tokens.color.primary[700],
                     border: `1px solid ${alpha(
                        tokens.color.primary[700],
                        0.25,
                     )}`,
                     borderRadius: `${tokens.radius.control}px`,
                     p: 0.75,
                     "&:hover": {
                        backgroundColor: alpha(tokens.color.primary[700], 0.06),
                     },
                  }}
               >
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
               </IconButton>
            </Tooltip>
         </Box>

         {/* Messages area */}
         <Box
            sx={{
               flex: 1,
               overflowY: "auto",
               px: 2.5,
               py: 2,
               display: "flex",
               flexDirection: "column",
               gap: 0.5,
               backgroundColor: tokens.color.background,
            }}
         >
            {loadingMessages ? (
               <Loading variant="section" minHeight={200} />
            ) : messages.length === 0 ? (
               <Box
                  sx={{
                     flex: 1,
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: 1,
                     py: 6,
                  }}
               >
                  <Typography
                     variant="body2"
                     sx={{
                        color: tokens.color.text.muted,
                        fontSize: "0.82rem",
                     }}
                  >
                     No messages yet — say hi! 👋
                  </Typography>
               </Box>
            ) : (
               groups.map((group) => (
                  <Box key={group.date}>
                     {/* Date separator */}
                     <Box
                        sx={{
                           display: "flex",
                           alignItems: "center",
                           gap: 1.5,
                           my: 2,
                        }}
                     >
                        <Box
                           sx={{
                              flex: 1,
                              height: 1,
                              backgroundColor: tokens.color.border,
                           }}
                        />
                        <Typography
                           variant="caption"
                           sx={{
                              color: tokens.color.text.muted,
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              flexShrink: 0,
                           }}
                        >
                           {group.date}
                        </Typography>
                        <Box
                           sx={{
                              flex: 1,
                              height: 1,
                              backgroundColor: tokens.color.border,
                           }}
                        />
                     </Box>

                     {/* Messages in group */}
                     {group.msgs.map((msg, i) => {
                        const isStudent = msg.sender === "student";
                        const prevMsg = group.msgs[i - 1];
                        const showAvatar =
                           !isStudent &&
                           (!prevMsg || prevMsg.sender !== msg.sender);

                        return (
                           <Box
                              key={msg.id}
                              sx={{
                                 display: "flex",
                                 justifyContent: isStudent
                                    ? "flex-end"
                                    : "flex-start",
                                 alignItems: "flex-end",
                                 gap: 1,
                                 mb: 0.75,
                              }}
                           >
                              {/* Advisor avatar spacer */}
                              {!isStudent && (
                                 <Box sx={{ width: 28, flexShrink: 0 }}>
                                    {showAvatar && (
                                       <Avatar
                                          sx={{
                                             width: 28,
                                             height: 28,
                                             backgroundColor: alpha(
                                                tokens.color.primary[700],
                                                0.12,
                                             ),
                                             color: tokens.color.primary[700],
                                             fontWeight: 700,
                                             fontSize: "0.65rem",
                                             borderRadius: `6px`,
                                          }}
                                       >
                                          {conversation.avatarInitials}
                                       </Avatar>
                                    )}
                                 </Box>
                              )}

                              <Box
                                 sx={{
                                    maxWidth: "72%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: isStudent
                                       ? "flex-end"
                                       : "flex-start",
                                    gap: 0.25,
                                 }}
                              >
                                 <Box
                                    sx={{
                                       px: 1.5,
                                       py: 1,
                                       borderRadius: isStudent
                                          ? "14px 14px 4px 14px"
                                          : "14px 14px 14px 4px",
                                       backgroundColor: isStudent
                                          ? tokens.color.primary[700]
                                          : tokens.color.surface,
                                       border: isStudent
                                          ? "none"
                                          : `1px solid ${tokens.color.border}`,
                                       boxShadow: isStudent
                                          ? "none"
                                          : tokens.shadow.sm,
                                    }}
                                 >
                                    <Typography
                                       sx={{
                                          fontSize: "0.845rem",
                                          lineHeight: 1.55,
                                          color: isStudent
                                             ? "#fff"
                                             : tokens.color.text.primary,
                                          wordBreak: "break-word",
                                       }}
                                    >
                                       {msg.status === "sending" ? (
                                          <Box
                                             component="span"
                                             sx={{ opacity: 0.7 }}
                                          >
                                             {msg.text}
                                          </Box>
                                       ) : (
                                          msg.text
                                       )}
                                    </Typography>
                                 </Box>

                                 {/* Time + status */}
                                 <Box
                                    sx={{
                                       display: "flex",
                                       alignItems: "center",
                                       gap: 0.5,
                                    }}
                                 >
                                    <Typography
                                       variant="caption"
                                       sx={{
                                          fontSize: "0.65rem",
                                          color: tokens.color.text.muted,
                                       }}
                                    >
                                       {formatMessageTime(msg.createdAt)}
                                    </Typography>
                                    {isStudent && (
                                       <Box
                                          sx={{
                                             color: tokens.color.text.muted,
                                             display: "flex",
                                          }}
                                       >
                                          {msg.status === "sending" ? (
                                             <CircularProgress
                                                size={10}
                                                sx={{
                                                   color: tokens.color.text
                                                      .muted,
                                                }}
                                             />
                                          ) : msg.status === "read" ? (
                                             <DoneAllIcon
                                                sx={{
                                                   fontSize: 13,
                                                   color: tokens.color
                                                      .primary[500],
                                                }}
                                             />
                                          ) : (
                                             <DoneIcon sx={{ fontSize: 13 }} />
                                          )}
                                       </Box>
                                    )}
                                 </Box>
                              </Box>
                           </Box>
                        );
                     })}
                  </Box>
               ))
            )}
            <div ref={bottomRef} />
         </Box>

         {/* Composer */}
         <Box
            sx={{
               px: 2,
               py: 1.5,
               borderTop: `1px solid ${tokens.color.border}`,
               display: "flex",
               gap: 1,
               alignItems: "flex-end",
               flexShrink: 0,
               backgroundColor: tokens.color.surface,
            }}
         >
            <TextField
               inputRef={inputRef}
               placeholder="Type a message…"
               value={text}
               onChange={(e) => setText(e.target.value)}
               onKeyDown={handleKeyDown}
               multiline
               maxRows={4}
               size="small"
               fullWidth
               disabled={sending}
               sx={{
                  "& .MuiOutlinedInput-root": {
                     borderRadius: `${tokens.radius.control}px`,
                     fontSize: "0.875rem",
                     "& fieldset": { borderColor: tokens.color.border },
                     "&:hover fieldset": {
                        borderColor: tokens.color.primary[500],
                     },
                     "&.Mui-focused fieldset": {
                        borderColor: tokens.color.primary[700],
                     },
                  },
               }}
            />
            <Box
               component="button"
               onClick={() => {
                  void handleSend();
               }}
               disabled={!text.trim() || sending}
               sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  borderRadius: `${tokens.radius.control}px`,
                  border: "none",
                  backgroundColor:
                     text.trim() && !sending
                        ? tokens.color.primary[700]
                        : alpha(tokens.color.primary[700], 0.25),
                  color: "#fff",
                  cursor: text.trim() && !sending ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.15s",
                  "&:hover:not(:disabled)": {
                     backgroundColor: tokens.color.primary[900],
                  },
               }}
            >
               {sending ? (
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
               ) : (
                  <SendIcon sx={{ fontSize: 17 }} />
               )}
            </Box>
         </Box>
      </Box>
   );
}
