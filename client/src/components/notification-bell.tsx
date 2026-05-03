"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "./notification-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 rounded-none border-black">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-widest">Notifications</h4>
          <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5">{unreadCount} New</span>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n._id}
                className={`flex flex-col items-start p-4 cursor-pointer rounded-none border-b border-slate-50 focus:bg-slate-50 ${
                  !n.read ? "bg-slate-50/50" : ""
                }`}
                onClick={() => markAsRead(n._id)}
              >
                <div className="flex justify-between w-full mb-1">
                  <span className="font-bold text-[10px] uppercase tracking-tight">
                    {n.title}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-tight">
                  {n.message}
                </p>
                {!n.read && (
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-black"></div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 text-center flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
