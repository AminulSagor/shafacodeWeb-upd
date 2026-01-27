"use client";

import {
  Bell,
  CheckCheck,
  Dot,
  FileText,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  updateDoc,
  doc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";
import SOPDeclineBtn from "../sop/SOPDeclineBtn";
import SOPApproveBtn from "../sop/SOPApproveBtn";
import Link from "next/link";

type NotificationItem = {
  id: string;
  userEmail: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  sopId?: string;
  sopCategory?: string;
  createdAt?: any; // Firestore Timestamp
};

function toDate(createdAt: any): Date | null {
  try {
    if (!createdAt) return null;
    // Firestore Timestamp has toDate()
    if (typeof createdAt?.toDate === "function") return createdAt.toDate();
    // Sometimes you store millis/iso
    if (typeof createdAt === "number") return new Date(createdAt);
    if (typeof createdAt === "string") return new Date(createdAt);
    return null;
  } catch {
    return null;
  }
}

function timeAgo(d: Date | null) {
  if (!d) return "";
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function pickIcon(type?: string) {
  const t = (type || "").toUpperCase();
  if (t.includes("SOP")) return FileText;
  if (t.includes("APPROV") || t.includes("ALERT")) return ShieldAlert;
  return Info;
}

export default function NotificationBell({
  userEmail,
  initialNotifications = [],
}: {
  userEmail: string;
  initialNotifications?: NotificationItem[];
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(firebaseClient, "notifications"),
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as any) }) as NotificationItem,
        );
        setNotifications(list);
      },
      (err) => {
        if ((err as any)?.name === "AbortError") return;
        console.error("Notification listener error:", err);
      },
    );

    return () => unsub();
  }, [userEmail]);

  const unread = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

    try {
      await updateDoc(doc(firebaseClient, "notifications", id), {
        isRead: true,
      });
    } catch (e) {
      // rollback if you want (optional)
      console.error(e);
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    // optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      // Batch write (works well if not too many)
      const batch = writeBatch(firebaseClient);
      unreadIds.forEach((id) => {
        batch.update(doc(firebaseClient, "notifications", id), {
          isRead: true,
        });
      });
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-full",
            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1">
              <Badge className="h-5 min-w-5 justify-center rounded-full bg-red-700 px-1 text-[11px]">
                {unread > 99 ? "99+" : unread}
              </Badge>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <p className="font-semibold leading-none">Notifications</p>
            {unread > 0 && (
              <span className="text-xs text-muted-foreground">
                ({unread} unread)
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            disabled={unread === 0}
            className="h-8 px-2"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all
          </Button>
        </div>

        {/* Body */}
        <ScrollArea className="h-[360px]">
          {notifications.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-medium">You’re all caught up</p>
              <p className="text-sm text-muted-foreground mt-1">
                No new notifications right now.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const Icon = pickIcon(n.type);
                const d = toDate(n.createdAt);
                const isUnread = !n.isRead;

                return (
                  <>
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "w-full text-left px-4 py-3",
                        "transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:bg-muted/60",
                        isUnread && "bg-blue-50 text-bold",
                      )}
                    >
                      <Link
                        href={`/admin/sop/${n.sopCategory}/${n.sopId}`}
                        className="cursor-pointer"
                      >
                        <div className="flex gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border",
                              isUnread ? "bg-background" : "bg-muted/50",
                            )}
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={cn(
                                  "truncate text-sm",
                                  isUnread ? "font-semibold" : "font-medium",
                                )}
                              >
                                {n.title || "Notification"}
                              </p>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {timeAgo(d)}
                                </span>
                                {isUnread && (
                                  <Dot className="h-6 w-6 text-primary" />
                                )}
                              </div>
                            </div>

                            {n.message && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {n.message?.length > 20
                                  ? `${n.message.slice(0, 20)}...`
                                  : n.message}
                              </p>
                            )}

                            {/* SOP actions */}
                            {n.type === "SOP_PENDING" &&
                              !n.isRead &&
                              n.sopId && (
                                <div className="mt-2 flex gap-2 group-hover:opacity-100 transition">
                                  <SOPApproveBtn sopId={n.sopId} />

                                  <SOPDeclineBtn sopId={n.sopId} />
                                </div>
                              )}
                          </div>
                        </div>
                      </Link>
                    </button>
                  </>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
