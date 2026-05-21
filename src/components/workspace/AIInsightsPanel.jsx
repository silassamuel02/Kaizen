import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

export default function AIInsightsPanel({ workspaceId }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    generateInsights();
  }, [workspaceId]);

  async function generateInsights() {
    try {
      setLoading(true);
      const { data: notes } = await supabase
        .from("notes")
        .select("*")
        .eq("workspace_id", workspaceId);

      const { data: activities } = await supabase
        .from("activities")
        .select("*")
        .eq("workspace_id", workspaceId);

      const { data: members } = await supabase
        .from("workspace_members")
        .select("*")
        .eq("workspace_id", workspaceId);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            notes,
            activities,
            members,
          }),
        }
      );

      const data = await response.json();
      setInsights(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("AI insights failed:", error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[var(--radius-lg)]
        border border-border
        bg-surface
        p-6
        space-y-6
        shadow-theme
        group
      "
    >
      {/* Ambient background effect */}
      <div
        className="
          absolute
          top-0
          right-0
          w-80
          h-80
          bg-gradient-to-br
          from-accent/5
          to-transparent
          blur-3xl
          group-hover:from-accent/8
          transition-all
          duration-500
          pointer-events-none
        "
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
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
              Artificial Intelligence
            </p>
            <h2
              className="
                text-xl
                font-bold
                tracking-tight
                text-text
              "
            >
              Workspace Intelligence
            </h2>
            <p className="text-text-2 mt-1.5 text-xs">
              AI-powered operational insights
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-success-soft border border-border">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-semibold text-success uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="relative z-10 py-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-border" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
            </div>
            <p className="text-text-2 text-xs font-medium">
              Generating AI insights...
            </p>
          </div>
        </div>
      ) : insights.length === 0 ? (
        <div className="relative z-10 py-10 text-center">
          <div className="inline-block p-5 rounded-[var(--radius-md)] bg-surface-2 border border-border">
            <p className="text-text-2 text-xs font-medium">
              No AI insights available
            </p>
            <p className="text-muted text-[11px] mt-1.5">
              Add notes and activities to generate insights
            </p>
          </div>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="
                  group/card
                  relative
                  overflow-hidden
                  rounded-[var(--radius-md)]
                  border border-border
                  bg-surface-2
                  p-5
                  transition-all
                  duration-250
                  hover:bg-surface-3
                  hover:shadow-theme
                "
              >
                {/* Card glow effect */}
                <div
                  className="
                    absolute
                    top-0
                    right-0
                    w-24
                    h-24
                    bg-accent/[0.03]
                    blur-xl
                    group-hover/card:bg-accent/[0.06]
                    transition-all
                    duration-250
                  "
                />

                {/* Pulsing indicator */}
                <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover/card:opacity-100 animate-pulse transition-opacity" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <p
                      className="
                        uppercase
                        tracking-[0.2em]
                        text-accent
                        text-[9px]
                        font-bold
                        mb-2.5
                      "
                    >
                      {insight.type}
                    </p>
                    <h3
                      className="
                        text-sm
                        font-semibold
                        tracking-tight
                        mb-2
                        text-text
                      "
                    >
                      {insight.title}
                    </h3>
                    <p className="text-text-2 text-xs leading-relaxed">
                      {insight.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="mt-4 pt-3.5 border-t border-border-soft flex items-center justify-between">
                    <span className="text-[10px] text-muted font-medium">AI Generated</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}