import { useNotifications } from "../../contexts/NotificationContext";

export default function NotificationCenter() {
  const { notifications } = useNotifications();

  return (
    <div
      className="
        fixed
        top-6
        right-6
        z-[999]
        space-y-3
        w-[360px]
        pointer-events-none
      "
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="
            relative
            overflow-hidden
            p-5
            rounded-[var(--radius-md)]
            border border-border
            bg-surface/90
            backdrop-blur-md
            shadow-theme-md
            animate-fade-slide
            pointer-events-auto
            group
            hover:border-border-medium
            transition-all
            duration-250
          "
        >
          {/* Subtle amber gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/5 to-transparent blur-xl group-hover:from-accent/10 transition-all duration-300" />

          {/* Left vertical amber indicator line */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent to-transparent" />

          <div className="relative z-10 space-y-1.5 pl-1">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-accent
                font-bold
              "
            >
              {notification.title}
            </p>

            <p className="text-sm text-text leading-relaxed font-medium">
              {notification.message}
            </p>

            {/* Bottom timestamp */}
            <div className="mt-3 pt-2.5 border-t border-border-soft text-[10px] text-muted font-medium">
              Just now
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}