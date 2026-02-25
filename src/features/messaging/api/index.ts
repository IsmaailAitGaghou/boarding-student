import { isMock } from "@/api/env";
// Re-use the same advisors from appointments — single source of truth
import { mockAdvisors } from "@/features/appointments/api";
import type { Conversation, Message, SendMessagePayload } from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Mock conversations (one per advisor) ────────────────────────────────────
const mockConversationsState: Conversation[] = [
   {
      id: "conv-1",
      advisorId: "adv-1",
      advisorName: "Sophie Martin",
      advisorRole: "Career Advisor",
      avatarInitials: "SM",
      lastMessage: "Looking forward to our session on Thursday!",
      lastMessageAt: "2026-02-24T15:30:00Z",
      unreadCount: 2,
   },
   {
      id: "conv-2",
      advisorId: "adv-2",
      advisorName: "James Okafor",
      advisorRole: "Academic Advisor",
      avatarInitials: "JO",
      lastMessage: "Please bring your transcript to the next meeting.",
      lastMessageAt: "2026-02-22T09:10:00Z",
      unreadCount: 0,
   },
   {
      id: "conv-3",
      advisorId: "adv-3",
      advisorName: "Lena Fischer",
      advisorRole: "Internship Advisor",
      avatarInitials: "LF",
      lastMessage: "I've found two companies that could be a great fit for you.",
      lastMessageAt: "2026-02-20T17:45:00Z",
      unreadCount: 1,
   },
   {
      id: "conv-4",
      advisorId: "adv-4",
      advisorName: "Carlos Reyes",
      advisorRole: "Placement Advisor",
      avatarInitials: "CR",
      lastMessage: "Your placement report has been submitted.",
      lastMessageAt: "2026-02-15T11:00:00Z",
      unreadCount: 0,
   },
];

// ─── Mock messages per conversation ─────────────────────────────────────────
const mockMessagesState: Record<string, Message[]> = {
   "conv-1": [
      {
         id: "msg-1-1",
         conversationId: "conv-1",
         sender: "advisor",
         text: "Hi! I reviewed your CV and it looks great. A few tweaks could make it even stronger.",
         createdAt: "2026-02-23T10:00:00Z",
         status: "read",
      },
      {
         id: "msg-1-2",
         conversationId: "conv-1",
         sender: "student",
         text: "Thanks Sophie! What sections would you suggest improving?",
         createdAt: "2026-02-23T10:05:00Z",
         status: "read",
      },
      {
         id: "msg-1-3",
         conversationId: "conv-1",
         sender: "advisor",
         text: "The skills section and the summary at the top. Let's go over it in our next session.",
         createdAt: "2026-02-23T10:08:00Z",
         status: "read",
      },
      {
         id: "msg-1-4",
         conversationId: "conv-1",
         sender: "advisor",
         text: "Looking forward to our session on Thursday!",
         createdAt: "2026-02-24T15:30:00Z",
         status: "delivered",
      },
   ],
   "conv-2": [
      {
         id: "msg-2-1",
         conversationId: "conv-2",
         sender: "student",
         text: "Hello James, I wanted to ask about my course plan for next semester.",
         createdAt: "2026-02-20T08:00:00Z",
         status: "read",
      },
      {
         id: "msg-2-2",
         conversationId: "conv-2",
         sender: "advisor",
         text: "Sure! You're on track. I'd recommend adding an elective in data analysis.",
         createdAt: "2026-02-20T09:00:00Z",
         status: "read",
      },
      {
         id: "msg-2-3",
         conversationId: "conv-2",
         sender: "advisor",
         text: "Please bring your transcript to the next meeting.",
         createdAt: "2026-02-22T09:10:00Z",
         status: "delivered",
      },
   ],
   "conv-3": [
      {
         id: "msg-3-1",
         conversationId: "conv-3",
         sender: "advisor",
         text: "I've been reviewing the internship listings and found some great matches for your profile.",
         createdAt: "2026-02-18T14:00:00Z",
         status: "read",
      },
      {
         id: "msg-3-2",
         conversationId: "conv-3",
         sender: "student",
         text: "That sounds amazing! Which companies did you have in mind?",
         createdAt: "2026-02-18T14:10:00Z",
         status: "read",
      },
      {
         id: "msg-3-3",
         conversationId: "conv-3",
         sender: "advisor",
         text: "I've found two companies that could be a great fit for you.",
         createdAt: "2026-02-20T17:45:00Z",
         status: "delivered",
      },
   ],
   "conv-4": [
      {
         id: "msg-4-1",
         conversationId: "conv-4",
         sender: "advisor",
         text: "Your placement assessment is complete. Overall score: 82/100.",
         createdAt: "2026-02-14T10:00:00Z",
         status: "read",
      },
      {
         id: "msg-4-2",
         conversationId: "conv-4",
         sender: "student",
         text: "Thank you Carlos! Is there anything I should work on before placement?",
         createdAt: "2026-02-14T10:15:00Z",
         status: "read",
      },
      {
         id: "msg-4-3",
         conversationId: "conv-4",
         sender: "advisor",
         text: "Your placement report has been submitted.",
         createdAt: "2026-02-15T11:00:00Z",
         status: "delivered",
      },
   ],
};

let _nextMsgId = 100;

// ─── API functions ─────────────────────────────────────────────────────────────

export async function getConversations(): Promise<Conversation[]> {
   if (isMock()) {
      await sleep(500);
      return [...mockConversationsState];
   }
   // TODO: return apiClient.get<Conversation[]>("/messaging/conversations");
   throw new Error("Real API not implemented");
}

export async function getMessages(conversationId: string): Promise<Message[]> {
   if (isMock()) {
      await sleep(350);
      return [...(mockMessagesState[conversationId] ?? [])];
   }
   // TODO: return apiClient.get<Message[]>(`/messaging/conversations/${conversationId}/messages`);
   throw new Error("Real API not implemented");
}

export async function sendMessage(
   conversationId: string,
   payload: SendMessagePayload,
): Promise<Message> {
   if (isMock()) {
      await sleep(450);
      const newMsg: Message = {
         id: `msg-opt-${_nextMsgId++}`,
         conversationId,
         sender: "student",
         text: payload.text,
         createdAt: new Date().toISOString(),
         status: "delivered",
      };
      if (!mockMessagesState[conversationId]) {
         mockMessagesState[conversationId] = [];
      }
      mockMessagesState[conversationId].push(newMsg);

      // Update conversation last message
      const convIdx = mockConversationsState.findIndex(
         (c) => c.id === conversationId,
      );
      if (convIdx !== -1) {
         mockConversationsState[convIdx] = {
            ...mockConversationsState[convIdx],
            lastMessage: payload.text,
            lastMessageAt: newMsg.createdAt,
         };
      }
      return { ...newMsg };
   }
   // TODO: return apiClient.post<Message>(`/messaging/conversations/${conversationId}/messages`, { json: payload });
   throw new Error("Real API not implemented");
}

export async function markConversationRead(conversationId: string): Promise<void> {
   if (isMock()) {
      await sleep(100);
      const idx = mockConversationsState.findIndex((c) => c.id === conversationId);
      if (idx !== -1) {
         mockConversationsState[idx] = {
            ...mockConversationsState[idx],
            unreadCount: 0,
         };
      }
      return;
   }
   // TODO: return apiClient.patch(`/messaging/conversations/${conversationId}/read`);
   throw new Error("Real API not implemented");
}

export async function startConversation(advisorId: string): Promise<Conversation> {
   if (isMock()) {
      await sleep(400);
      // Return existing if already present
      const existing = mockConversationsState.find(
         (c) => c.advisorId === advisorId,
      );
      if (existing) return { ...existing };

      const advisor = mockAdvisors.find((a) => a.id === advisorId);
      if (!advisor) throw new Error("Advisor not found");

      const newConv: Conversation = {
         id: `conv-${Date.now()}`,
         advisorId: advisor.id,
         advisorName: advisor.name,
         advisorRole: advisor.role,
         avatarInitials: advisor.avatarInitials,
         lastMessage: "",
         lastMessageAt: new Date().toISOString(),
         unreadCount: 0,
      };
      mockConversationsState.unshift(newConv);
      mockMessagesState[newConv.id] = [];
      return { ...newConv };
   }
   // TODO: return apiClient.post<Conversation>("/messaging/conversations", { json: { advisorId } });
   throw new Error("Real API not implemented");
}
