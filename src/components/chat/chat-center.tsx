"use client";

import { useEffect, useRef } from "react";
import { Send, Sparkles, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { ChatMessage } from "./chat-message";
import { cn } from "@/lib/utils";

interface Props {
  messages: Message[];
  input: string;
  isLoading: boolean;
  isOptimizing: boolean;
  onInputChange: (value: string) => void;
  onSend: (promptOverride?: string) => void;
  onOptimize: () => void;
}

export function ChatCenter({ messages, input, isLoading, isOptimizing, onInputChange, onSend, onOptimize }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-2">
        <Leaf className="h-4 w-4 text-green-600" />
        <span className="font-medium text-sm">GreenMind Chat</span>
        <span className="text-xs text-muted-foreground ml-auto">Every prompt is analyzed for sustainability</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Start a sustainable conversation</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Type your prompt below. GreenMind will analyze its sustainability score, route it to the most efficient model, and display real-time environmental metrics.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {[
                  "What is photosynthesis?",
                  "Write a blog post about climate change",
                  "Debug this Python function: def add(a,b): return a-b",
                  "Translate 'Hello world' to French",
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => onInputChange(suggestion)}
                    className="text-left text-sm p-3 rounded-lg border border-border hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors text-muted-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className={cn("w-2 h-2 rounded-full bg-green-600 animate-bounce")} style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-muted/50 border border-border rounded-xl p-3 focus-within:border-green-400 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything — GreenMind will optimize your prompt sustainability..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed max-h-48 overflow-y-auto"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onOptimize}
                disabled={!input.trim() || isOptimizing}
                className="gap-1.5 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 h-8"
                title="Optimize prompt"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isOptimizing ? "Optimizing..." : "Optimize"}
              </Button>
              <Button
                size="sm"
                onClick={() => onSend()}
                disabled={!input.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0 rounded-lg"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send · Shift+Enter for new line · Click Optimize to improve sustainability
          </p>
        </div>
      </div>
    </div>
  );
}
