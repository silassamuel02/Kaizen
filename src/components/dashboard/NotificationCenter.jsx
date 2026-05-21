import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../supabase/client";

export default function NotificationCenter() {

  const [notifications,
    setNotifications] =
    useState([]);

  useEffect(() => {

    fetchNotifications();

    const channel = supabase

      .channel(
        "notifications-live"
      )

      .on(
        "postgres_changes",

        {
          event: "INSERT",
          schema: "public",
          table: "activities",
        },

        () => {
          fetchNotifications();
        }
      )

      .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, []);

  async function fetchNotifications() {

    const {
      data,
      error,
    } = await supabase

      .from("activities")

      .select("*")

      .order(
        "created_at",
        {
          ascending: false,
        }
      )

      .limit(6);

    if (error) {

      console.error(error);

      return;
    }

    setNotifications(
      data || []
    );
  }

  return (

    <section
      className="
        relative
        overflow-hidden
        rounded-[40px]
        border border-white/5
        bg-white/[0.02]
        backdrop-blur-glass
        p-10
        shadow-premium
        group
      "
    >

      {/* Ambient glow */}
      <div
        className="
          absolute
          top-0
          right-0
          w-72
          h-72
          bg-red-500/[0.08]
          blur-3xl
          group-hover:from-red-500/[0.12]
          transition-all
          duration-500
        "
      />

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          mb-10
        "
      >

        <div>

          <p
            className="
              uppercase
              tracking-[0.35em]
              text-red-300/70
              text-[10px]
              font-semibold
              mb-3
            "
          >
            Notification Stream
          </p>

          <h2
            className="
              text-4xl
              font-black
              tracking-[-0.05em]
              text-white
            "
          >
            Live system events
          </h2>

        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Live</span>
          </div>
        )}

      </div>

      {notifications.length === 0 ? (

        <div className="relative z-10 py-8 text-center">
          <p className="text-slate-500 font-medium">No notifications yet</p>
          <p className="text-slate-600 text-sm mt-1">System events will appear here</p>
        </div>

      ) : (

        <div className="relative z-10 space-y-3">

          {notifications.map((item, index) => (

            <div
              key={item.id}

              className="
                group/item
                relative
                overflow-hidden
                rounded-3xl
                border border-white/5
                bg-white/[0.02]
                backdrop-blur-glass
                p-6
                transition-all
                duration-250
                ease-smooth
                hover:border-white/10
                hover:bg-white/[0.04]
                hover:shadow-glow
                hover:-translate-y-0.5
                animate-fade-in
              "
              style={{ animationDelay: `${index * 50}ms` }}
            >

              {/* Left accent indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-transparent group-hover/item:from-red-300 transition-colors duration-300" />

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">

                <p
                  className="
                    uppercase
                    tracking-[0.3em]
                    text-red-300/70
                    text-[9px]
                    font-semibold
                    mb-2
                    group-hover/item:text-red-300
                    transition-colors
                    duration-300
                  "
                >
                  {item.type}
                </p>

                <h3
                  className="
                    text-lg
                    font-black
                    tracking-[-0.03em]
                    text-white
                    group-hover/item:text-red-100
                    transition-colors
                    duration-300
                  "
                >
                  {item.description}
                </h3>

                <div
                  className="
                    mt-4
                    text-xs
                    uppercase
                    tracking-[0.25em]
                    text-slate-500
                    group-hover/item:text-slate-400
                    transition-colors
                    duration-300
                    font-medium
                  "
                >
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}