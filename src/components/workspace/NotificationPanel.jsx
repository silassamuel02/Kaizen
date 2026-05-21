import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

export default function NotificationPanel({ workspaceId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel(`notifications-${workspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        fetchNotifications
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  async function fetchNotifications() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(5);

    setNotifications(data || []);
  }

  return (
    <section
      className="
        rounded-[var(--radius-lg)]
        border border-border
        bg-surface
        p-6
        space-y-5
      "
    >
      <div>
        <p
          className="
            uppercase
            tracking-[0.2em]
            text-accent
            text-[10px]
            font-bold
            mb-1.5
          "
        >
          Realtime Systems
        </p>
        <h2
          className="
            text-xl
            font-bold
            tracking-tight
            text-text
          "
        >
          Workspace Notifications
        </h2>
      </div>

      {notifications.length === 0 ? (
        <div className="text-sm text-muted py-2">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="
                rounded-[var(--radius-md)]
                border border-border
                bg-surface-2
                p-4
                hover:bg-surface-3
                transition-colors
                duration-250
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p
                    className="
                      uppercase
                      tracking-[0.15em]
                      text-accent
                      text-[9px]
                      font-bold
                    "
                  >
                    {notification.type}
                  </p>
                  <h3
                    className="
                      text-sm
                      font-semibold
                      tracking-tight
                      text-text
                    "
                  >
                    {notification.title}
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                <div className="text-[10px] text-muted font-medium whitespace-nowrap">
                  {new Date(notification.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}