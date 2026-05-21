import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Bell,
  Sparkles,
} from "lucide-react";

const notifications = [
  {
    title: "AI generated new insight",
    time: "2m ago",
  },
  {
    title: "Workspace updated",
    time: "12m ago",
  },
  {
    title: "Realtime sync active",
    time: "Live",
  },
  {
    title: "Operational analysis complete",
    time: "1h ago",
  },
];

export default function NotificationDrawer({
  open,
  setOpen,
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent
        side="right"
        className="
          border-l border-border
          bg-surface
          text-text
          w-full max-w-[420px]
          sm:w-[420px]
        "
      >
        <SheetHeader className="p-0 mb-6">
          <SheetTitle
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-text"
          >
            <Bell size={20} className="text-accent" />
            Notifications
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3">
          {notifications.map((item, index) => (
            <div
              key={index}
              className="
                relative
                overflow-hidden
                rounded-[var(--radius-md)]
                border border-border
                bg-surface-2
                p-4.5
                hover:bg-surface-3
                transition-all
                duration-250
              "
            >
              {/* Subtle accent blob */}
              <div
                className="
                  absolute
                  top-[-20px]
                  right-[-20px]
                  w-24
                  h-24
                  rounded-full
                  bg-accent/5
                  blur-2xl
                "
              />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    <Sparkles
                      size={15}
                      className="text-accent"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      {item.title}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}