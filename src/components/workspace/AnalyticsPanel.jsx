import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPanel({ workspaceId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [workspaceId]);

  async function fetchAnalytics() {
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", workspaceId);

    const todo = tasks?.filter((t) => t.status === "todo").length || 0;
    const progress = tasks?.filter((t) => t.status === "in-progress").length || 0;
    const done = tasks?.filter((t) => t.status === "done").length || 0;

    setData([
      { name: "Todo", value: todo },
      { name: "In Progress", value: progress },
      { name: "Done", value: done },
    ]);
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
          Operational Metrics
        </p>
        <h2
          className="
            text-xl
            font-bold
            tracking-tight
            text-text
          "
        >
          Workspace Analytics
        </h2>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-2)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="var(--text-2)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-2)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                color: "var(--text)",
              }}
              cursor={{ fill: 'var(--border-soft)' }}
            />
            <Bar 
              dataKey="value" 
              fill="var(--accent)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}