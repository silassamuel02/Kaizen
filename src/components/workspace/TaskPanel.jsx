import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function TaskPanel({ workspaceId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel(`tasks-${workspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        fetchTasks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  async function fetchTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    setTasks(data || []);
  }

  async function createTask() {
    if (!title.trim()) return;

    await supabase
      .from("tasks")
      .insert([
        {
          workspace_id: workspaceId,
          title,
          description,
          priority,
          assigned_to: assignedTo,
          due_date: dueDate,
        },
      ]);

    await supabase
      .from("activities")
      .insert([
        {
          workspace_id: workspaceId,
          type: "Task Created",
          description: `Created task: ${title}`,
        },
      ]);

    await supabase
      .from("notifications")
      .insert([
        {
          workspace_id: workspaceId,
          title: "New Task Created",
          message: `${title} was added.`,
          type: "task",
        },
      ]);

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setPriority("medium");
    fetchTasks();
  }

  async function updateStatus(taskId, status) {
    await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId);

    fetchTasks();
  }

  return (
    <section
      className="
        rounded-[var(--radius-lg)]
        border border-border
        bg-surface
        p-6
        space-y-6
        shadow-theme
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
          Execution Layer
        </p>
        <h2
          className="
            text-xl
            font-bold
            tracking-tight
            text-text
          "
        >
          Workspace Tasks
        </h2>
      </div>

      {/* Create Task */}
      <div className="space-y-4">
        <Input
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="
            w-full
            min-h-[100px]
            px-4.5
            py-3
            rounded-[var(--radius-md)]
            bg-surface-2
            border border-border
            text-text
            placeholder:text-muted
            outline-none
            resize-none
            hover:border-border-medium
            focus:border-accent
            focus:bg-surface
            transition-all
            duration-200
            text-xs
          "
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <div>
            <label className="text-[11px] font-bold text-text-2 mb-1.5 block">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="
                w-full
                px-3
                py-2.5
                rounded-[var(--radius-md)]
                bg-surface-2
                border border-border
                text-text
                text-xs
                outline-none
                hover:border-border-medium
                focus:border-accent
                transition-colors
                duration-200
              "
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-text-2 mb-1.5 block">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="
                w-full
                px-3
                py-2
                rounded-[var(--radius-md)]
                bg-surface-2
                border border-border
                text-text
                text-xs
                outline-none
                hover:border-border-medium
                focus:border-accent
                transition-colors
                duration-200
              "
            />
          </div>
        </div>

        <Button onClick={createTask} size="sm">
          Create Task
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-xs text-muted text-center py-2">
            No operational tasks yet.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="
                rounded-[var(--radius-md)]
                border border-border
                bg-surface-2
                p-4.5
                hover:bg-surface-3
                transition-colors
                duration-200
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] font-bold text-accent uppercase tracking-wider">
                      {task.priority}
                    </span>
                    <span className="text-[9px] font-semibold text-muted uppercase tracking-wider">
                      {task.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold tracking-tight text-text">
                    {task.title}
                  </h3>

                  <p className="text-xs text-text-2 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-[10px] text-muted font-medium">
                    <span>
                      Assigned: {task.assigned_to || "Unassigned"}
                    </span>
                    <span>
                      Due: {task.due_date || "No date"}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="
                      px-2.5
                      py-1.5
                      rounded-[var(--radius-sm)]
                      bg-surface
                      border border-border
                      text-text-2
                      text-[11px]
                      outline-none
                      hover:border-border-medium
                      focus:border-accent
                      transition-colors
                      duration-200
                    "
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}