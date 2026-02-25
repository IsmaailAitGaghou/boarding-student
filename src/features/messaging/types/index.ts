export type MessageSender = "student" | "advisor";

export type MessageStatus = "sending" | "delivered" | "read";

export interface Message {
   id: string;
   conversationId: string;
   sender: MessageSender;
   text: string;
   /** ISO datetime string */
   createdAt: string;
   status?: MessageStatus;
}

export interface Conversation {
   id: string;
   /** References advisor.id from @/features/appointments */
   advisorId: string;
   advisorName: string;
   advisorRole: string;
   avatarInitials: string;
   lastMessage: string;
   /** ISO datetime string */
   lastMessageAt: string;
   unreadCount: number;
}

export interface SendMessagePayload {
   text: string;
}
