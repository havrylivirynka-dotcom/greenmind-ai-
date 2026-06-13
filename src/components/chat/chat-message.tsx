"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Message } from "@/types/chat";
import { cn, getScoreColor } from "@/lib/utils";

interface Props { message: Message; }

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
        isUser ? "bg-muted" : "bg-green-600"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Leaf className="w-4 h-4 text-white" />}
      </div>
      <div className={cn("flex-1 max-w-[80%]", isUser && "flex flex-col items-end")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-green-600 text-white rounded-tr-sm"
            : "bg-muted rounded-tl-sm"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/5 prose-pre:rounded prose-code:text-green-700 dark:prose-code:text-green-400"
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {message.analytics && (
          <div className={cn("flex items-center gap-2 mt-1.5 flex-wrap", isUser && "justify-end")}>
            {message.model && (
              <Badge variant="outline" className="text-xs h-5 font-mono">{message.model}</Badge>
            )}
            <span className={cn("text-xs font-medium", getScoreColor(message.analytics.gaei))}>
              GAEI {message.analytics.gaei}
            </span>
            <span className={cn("text-xs font-medium", getScoreColor(message.analytics.pss))}>
              PSS {message.analytics.pss}
            </span>
            <span className="text-xs text-muted-foreground">MIT-{message.analytics.mit}</span>
            <span className="text-xs text-muted-foreground">{message.analytics.tokens} tokens</span>
          </div>
        )}
        <span className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
