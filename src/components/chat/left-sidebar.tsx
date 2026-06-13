"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Plus, BarChart3, Settings, Download, FlaskConical, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface Props {
  messages: Message[];
  researchMode: boolean;
  onToggleResearch: () => void;
  onExport: (format: "csv" | "json") => void;
  onNewChat: () => void;
}

export function LeftSidebar({ messages, researchMode, onToggleResearch, onExport, onNewChat }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const userMessages = messages.filter(m => m.role === "user");

  return (
    <div className={cn("flex flex-col border-r border-border bg-background transition-all duration-200", collapsed ? "w-14" : "w-64")}>
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center flex-shrink-0">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">GreenMind</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center mx-auto">
            <Leaf className="w-4 h-4 text-white" />
          </div>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <Button
          variant="outline"
          className={cn("w-full gap-2 text-sm", collapsed && "px-0 justify-center")}
          onClick={onNewChat}
          size="sm"
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Conversation History */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">This Session</p>
          {userMessages.length === 0 ? (
            <p className="text-xs text-muted-foreground px-1">No messages yet</p>
          ) : (
            userMessages.slice(-10).reverse().map(m => (
              <div key={m.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted cursor-pointer text-xs text-muted-foreground truncate">
                <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="truncate">{m.content.slice(0, 40)}{m.content.length > 40 ? "…" : ""}</span>
              </div>
            ))
          )}
        </div>
      )}

      <Separator />

      {/* Statistics */}
      {!collapsed && (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-1">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Session Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Prompts", value: userMessages.length },
              { label: "Avg PSS", value: messages.filter(m => m.analytics).length > 0 ? Math.round(messages.filter(m => m.analytics).reduce((acc, m) => acc + (m.analytics?.pss ?? 0), 0) / messages.filter(m => m.analytics).length) : "—" },
            ].map(s => (
              <div key={s.label} className="bg-muted rounded-md p-2 text-center">
                <div className="text-sm font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Research Mode */}
      <div className={cn("p-3", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <FlaskConical className="h-3.5 w-3.5 text-green-600" />
              <span className="font-medium">Research Mode</span>
            </div>
            <Switch checked={researchMode} onCheckedChange={onToggleResearch} />
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleResearch}>
            <FlaskConical className={cn("h-4 w-4", researchMode && "text-green-600")} />
          </Button>
        )}
        {!collapsed && researchMode && (
          <div className="mt-3 space-y-1">
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => onExport("csv")}>
              <Download className="h-3 w-3" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => onExport("json")}>
              <Download className="h-3 w-3" /> Export JSON
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Footer */}
      <div className={cn("p-3 flex items-center gap-2", collapsed && "justify-center")}>
        <ThemeToggle />
        {!collapsed && (
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <BarChart3 className="h-3.5 w-3.5" /> Dashboard
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
