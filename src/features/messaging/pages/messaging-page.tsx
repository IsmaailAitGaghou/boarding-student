import { useState, useCallback } from "react";
import { Box, Divider } from "@mui/material";
import { tokens } from "@/app/theme";
import {
   getConversations,
   getMessages,
   sendMessage,
   markConversationRead,
   startConversation,
} from "../api";
import { ConversationList } from "../components/conversation-list";
import { ChatWindow } from "../components/chat-window";
import { NewChatDialog } from "../components/new-chat-dialog";
import type { Conversation, Message } from "../types";

// State helpers

type MsgMap = Record<string, Message[]>;

// Page

export function MessagingPage() {
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [loadingConvs, setLoadingConvs] = useState(true);

   // Per-conversation messages
   const [messageMap, setMessageMap] = useState<MsgMap>({});
   const [loadingMsgs, setLoadingMsgs] = useState(false);

   // Selected conversation
   const [selectedId, setSelectedId] = useState<string | null>(null);

   // New chat dialog
   const [newChatOpen, setNewChatOpen] = useState(false);
   const [startingChat, setStartingChat] = useState(false);

   // Sending state
   const [sending, setSending] = useState(false);

   // Load conversations on mount
   useState(() => {
      setLoadingConvs(true);
      getConversations()
         .then((data) => {
            setConversations(data);
         })
         .catch(() => {
            /* silently handled */
         })
         .finally(() => setLoadingConvs(false));
   });

   // Select a conversation 
   const handleSelect = useCallback(
      async (id: string) => {
         if (id === selectedId) return;
         setSelectedId(id);

         
         setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
         );

         // Load messages if not already cached
         if (!messageMap[id]) {
            setLoadingMsgs(true);
            try {
               const msgs = await getMessages(id);
               setMessageMap((prev) => ({ ...prev, [id]: msgs }));
            } catch {
               /* ignore for now */
            } finally {
               setLoadingMsgs(false);
            }
         }

         // Fire-and-forget: mark read on server
         void markConversationRead(id);
      },
      [selectedId, messageMap],
   );

   // Send a message 
   const handleSend = useCallback(
      async (text: string) => {
         if (!selectedId) return;
         setSending(true);

         // Optimistic message
         const optimisticId = `opt-${Date.now()}`;
         const optimistic: Message = {
            id: optimisticId,
            conversationId: selectedId,
            sender: "student",
            text,
            createdAt: new Date().toISOString(),
            status: "sending",
         };
         setMessageMap((prev) => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] ?? []), optimistic],
         }));

         try {
            const saved = await sendMessage(selectedId, { text });
            // Replace optimistic with real message
            setMessageMap((prev) => ({
               ...prev,
               [selectedId]: (prev[selectedId] ?? []).map((m) =>
                  m.id === optimisticId ? saved : m,
               ),
            }));
            // Update conversation preview
            setConversations((prev) =>
               prev.map((c) =>
                  c.id === selectedId
                     ? {
                          ...c,
                          lastMessage: text,
                          lastMessageAt: saved.createdAt,
                       }
                     : c,
               ),
            );
         } catch {
            // Mark as failed (reuse "sending" for simplicity)
         } finally {
            setSending(false);
         }
      },
      [selectedId],
   );

   // Start new conversation
   const handleStartChat = useCallback(
      async (advisorId: string) => {
         setStartingChat(true);
         try {
            const conv = await startConversation(advisorId);
            // Add to list if new
            setConversations((prev) => {
               const exists = prev.some((c) => c.id === conv.id);
               return exists ? prev : [conv, ...prev];
            });
            setNewChatOpen(false);
            void handleSelect(conv.id);
         } catch {
            /* ignore */
         } finally {
            setStartingChat(false);
         }
      },
      [handleSelect],
   );

   
   const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;
   const currentMessages = selectedId ? messageMap[selectedId] ?? [] : [];


   return (
      <Box
         sx={{
            display: "flex",
            height: "calc(100vh - 64px)",
            overflow: "hidden",
            maxWidth: 1200,
            mx: "auto",
            gap: 2,
            backgroundColor: tokens.color.background,
         }}
      >
         {/* Left: Conversation list */}
         <Box
            sx={{
               width: { xs: "100%", sm: 300 },
               display: {
                  xs: selectedId !== null ? "none" : "flex",
                  sm: "flex",
               },
               flexDirection: "column",
               borderRight: { sm: `1px solid ${tokens.color.border}` },
               flexShrink: 0,
               backgroundColor: tokens.color.surface,
            }}
         >
            <ConversationList
               conversations={conversations}
               selectedId={selectedId}
               loading={loadingConvs}
               onSelect={(id) => {
                  void handleSelect(id);
               }}
               onNewChat={() => setNewChatOpen(true)}
            />
         </Box>

         <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", sm: "block" } }}
         />

         {/* ── Right: Chat window ────────────────────────────────────────── */}
         <Box
            sx={{
               flex: 1,
               display: {
                  xs: selectedId !== null ? "flex" : "none",
                  sm: "flex",
               },
               flexDirection: "column",
               minWidth: 0,
            }}
         >
            <ChatWindow
               conversation={selectedConv}
               messages={currentMessages}
               loadingMessages={loadingMsgs}
               sending={sending}
               onSend={handleSend}
               onBack={() => setSelectedId(null)}
               showBack={selectedId !== null}
            />
         </Box>

         {/* ── New chat dialog ───────────────────────────────────────────── */}
         <NewChatDialog
            key={newChatOpen ? "open" : "closed"}
            open={newChatOpen}
            starting={startingChat}
            onStart={(id) => {
               void handleStartChat(id);
            }}
            onClose={() => setNewChatOpen(false)}
         />
      </Box>
   );
}
