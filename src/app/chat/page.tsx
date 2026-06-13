import { ChatInterface } from "@/components/chat/chat-interface";
import { Metadata } from "next";

export const metadata: Metadata = { title: "GreenMind AI — Chat" };

export default function ChatPage() {
  return <ChatInterface />;
}
