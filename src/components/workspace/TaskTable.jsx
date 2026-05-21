import Button from "../ui/Button";

const tasks = [
  {
    title: "Deploy edge function",
    status: "Completed",
    owner: "Silas",
    updated: "4m ago",
  },
  {
    title: "Realtime sync validation",
    status: "In Progress",
    owner: "Operations",
    updated: "12m ago",
  },
  {
    title: "Workspace analytics review",
    status: "Pending",
    owner: "Analytics",
    updated: "1h ago",
  },
  {
    title: "Database optimization",
    status: "Completed",
    owner: "Infrastructure",
    updated: "2h ago",
  },
];

export default function TaskTable() {
  return (
    <div
      className="
        overflow-hidden
        rounded-[var(--radius-lg)]
        border border-border
        bg-surface
        shadow-theme
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-4.5
          border-b border-border
        "
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-1">
            Workspace Tasks
          </p>
          <h3 className="text-base font-bold tracking-tight text-text">
            Operational Queue
          </h3>
        </div>

        <Button size="sm">
          New Task
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th
                className="
                  px-6
                  py-3.5
                  text-left
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-muted
                  font-semibold
                "
              >
                Task
              </th>
              <th
                className="
                  px-6
                  py-3.5
                  text-left
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-muted
                  font-semibold
                "
              >
                Status
              </th>
              <th
                className="
                  px-6
                  py-3.5
                  text-left
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-muted
                  font-semibold
                "
              >
                Owner
              </th>
              <th
                className="
                  px-6
                  py-3.5
                  text-left
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-muted
                  font-semibold
                "
              >
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="
                  border-b border-border-soft
                  hover:bg-surface-2
                  transition-colors
                  duration-150
                "
              >
                <td className="px-6 py-4">
                  <p className="text-xs font-semibold text-text">
                    {task.title}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-2.5
                      py-1
                      rounded-full
                      border border-border
                      bg-surface-2
                    "
                  >
                    <div
                      className={`
                        w-1.5
                        h-1.5
                        rounded-full
                        ${
                          task.status === "Completed"
                            ? "bg-success"
                            : task.status === "In Progress"
                            ? "bg-accent"
                            : "bg-muted"
                        }
                      `}
                    />
                    <span className="text-[11px] font-medium text-text-2">
                      {task.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-text-2">
                  {task.owner}
                </td>
                <td className="px-6 py-4 text-xs text-muted">
                  {task.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}