import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/client";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import TaskPanel from "../../components/workspace/TaskPanel";
import AIInsightsPanel from "../../components/workspace/AIInsightsPanel";
import NotificationPanel from "../../components/workspace/NotificationPanel";
import AnalyticsPanel from "../../components/workspace/AnalyticsPanel";
import FileUploadPanel from "../../components/workspace/FileUploadPanel";

export default function WorkspaceDetailsPage() {
  const { id } = useParams();

  const [workspace, setWorkspace] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspace();

    const channel = supabase
      .channel(`workspace-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        fetchWorkspace
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
        },
        fetchWorkspace
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workspace_members",
        },
        fetchWorkspace
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function fetchWorkspace() {
    try {
      setLoading(true);

      const { data: workspaceData } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", id)
        .single();

      const { data: notesData } = await supabase
        .from("notes")
        .select("*")
        .eq("workspace_id", id)
        .order("created_at", { ascending: false });

      const { data: activityData } = await supabase
        .from("activities")
        .select("*")
        .eq("workspace_id", id)
        .order("created_at", { ascending: false });

      const { data: memberData } = await supabase
        .from("workspace_members")
        .select(`
          *,
          profiles (
            full_name,
            role,
            avatar_url
          )
        `)
        .eq("workspace_id", id)
        .order("created_at", { ascending: true });

      setWorkspace(workspaceData);
      setNotes(notesData || []);
      setActivities(activityData || []);
      setMembers(memberData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createNote() {
    if (!title.trim()) return;

    setCreating(true);

    const { error } = await supabase
      .from("notes")
      .insert([
        {
          workspace_id: id,
          title,
          content,
        },
      ]);

    if (!error) {
      await supabase
        .from("activities")
        .insert([
          {
            workspace_id: id,
            type: "Note Created",
            description: `Created note: ${title}`,
          },
        ]);

      await supabase
        .from("notifications")
        .insert([
          {
            workspace_id: id,
            title: "New Note Created",
            message: `${title} was added to the workspace.`,
            type: "note",
          },
        ]);

      setTitle("");
      setContent("");
      fetchWorkspace();
    }

    setCreating(false);
  }

  async function deleteNote(noteId) {
    const note = notes.find((n) => n.id === noteId);

    await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    await supabase
      .from("activities")
      .insert([
        {
          workspace_id: id,
          type: "Note Deleted",
          description: `Deleted note: ${note?.title}`,
        },
      ]);

    fetchWorkspace();
  }

  function startEditing(note) {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  async function updateNote() {
    await supabase
      .from("notes")
      .update({
        title: editTitle,
        content: editContent,
      })
      .eq("id", editingNoteId);

    await supabase
      .from("activities")
      .insert([
        {
          workspace_id: id,
          type: "Note Updated",
          description: `Updated note: ${editTitle}`,
        },
      ]);

    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
    fetchWorkspace();
  }

  async function addMember() {
    if (!memberEmail.trim()) return;

    await supabase
      .from("workspace_members")
      .insert([
        {
          workspace_id: id,
          email: memberEmail,
        },
      ]);

    await supabase
      .from("activities")
      .insert([
        {
          workspace_id: id,
          type: "Member Added",
          description: `Added member: ${memberEmail}`,
        },
      ]);

    await supabase
      .from("notifications")
      .insert([
        {
          workspace_id: id,
          title: "New Member Added",
          message: `${memberEmail} joined the workspace.`,
          type: "member",
        },
      ]);

    setMemberEmail("");
    fetchWorkspace();
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--border-medium)', borderTopColor: 'var(--accent)' }}
        />
        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
          Loading workspace...
        </span>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--danger)' }}>
          Error
        </span>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          Workspace not found
        </h2>
        <p className="text-sm max-w-sm" style={{ color: 'var(--text-2)' }}>
          The operational workspace you are trying to access does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Hero */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[var(--radius-lg)]
          border border-border
          bg-surface
          p-6 sm:p-8
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
            w-96
            h-96
            bg-gradient-to-br
            from-accent-soft
            to-transparent
            blur-3xl
            opacity-50
            pointer-events-none
          "
        />

        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1.5">
              Operational Workspace
            </p>

            <h1
              className="
                text-2xl sm:text-3xl
                font-bold
                tracking-tight
                text-text
              "
              style={{ letterSpacing: '-0.03em' }}
            >
              {workspace.name}
            </h1>

            <p
              className="
                text-text-2
                text-sm
                max-w-2xl
                mt-3
                leading-relaxed
              "
            >
              {workspace.description || "No operational description available."}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--success-soft)', border: '1px solid var(--border)', color: 'var(--success)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
              Live
            </div>

            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
              {members.length} members
            </div>
          </div>
        </div>
      </section>

      {/* AI Panel */}
      <AIInsightsPanel workspaceId={id} />

      {/* Task Panel */}
      <TaskPanel workspaceId={id} />

      {/* Analytics */}
      <AnalyticsPanel workspaceId={id} />

      {/* Files */}
      <FileUploadPanel workspaceId={id} />

      {/* Notifications */}
      <NotificationPanel workspaceId={id} />

      {/* Create Note */}
      <section
        className="
          rounded-[var(--radius-lg)]
          border border-border
          bg-surface
          p-6
          space-y-4
        "
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">
            Workspace Intelligence
          </p>
          <h2 className="text-base font-bold tracking-tight text-text">
            Create operational note.
          </h2>
        </div>

        <Input
          label="Note Title"
          placeholder="Realtime Systems..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write operational intelligence..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-base min-h-[160px] resize-none"
        />

        <Button onClick={createNote} disabled={creating}>
          {creating ? "Creating..." : "Create Note"}
        </Button>
      </section>

      {/* Notes */}
      <section className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-text">
          Workspace Notes
        </h2>

        {notes.length === 0 ? (
          <div
            className="
              rounded-[var(--radius-lg)]
              border border-border
              bg-surface
              p-6
              text-sm
              text-muted
              text-center
            "
          >
            No notes connected to this workspace yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="
                  rounded-[var(--radius-lg)]
                  border border-border
                  bg-surface
                  p-6
                  space-y-4
                "
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-4">
                    <Input
                      label="Edit Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />

                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="input-base min-h-[140px] resize-none"
                    />

                    <div className="flex gap-2">
                      <Button onClick={updateNote} size="sm">
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingNoteId(null)}
                        variant="secondary"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm font-semibold tracking-tight text-text">
                        {note.title}
                      </h3>

                      <div className="flex gap-3">
                        <button
                          onClick={() => startEditing(note)}
                          className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-xs font-medium hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--danger)' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-2">
                      {note.content}
                    </p>

                    <div className="text-[10px] uppercase tracking-[0.15em] text-muted">
                      Created: {new Date(note.created_at).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Members */}
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">
            Collaboration Systems
          </p>
          <h2 className="text-base font-bold tracking-tight text-text">
            Workspace members.
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end w-full">
          <div className="flex-1 w-full">
            <Input
              label="Member Email"
              placeholder="operator@kaizen.ai"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto">
            <Button onClick={addMember} className="w-full">
              Add Member
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.length === 0 ? (
            <div className="text-sm text-muted py-2 col-span-full">
              No members added yet.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="
                  rounded-[var(--radius-md)]
                  border border-border
                  bg-surface-2
                  p-4
                  hover:bg-surface-3
                  transition-colors
                  duration-200
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    overflow-hidden
                    border border-border
                    bg-surface-3
                    flex-shrink-0
                  "
                >
                  {member.profiles?.avatar_url ? (
                    <img
                      src={member.profiles.avatar_url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                        bg-accent-soft
                        text-accent
                        font-bold
                        text-xs
                      "
                    >
                      {(member.email?.[0] || "K").toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-tight text-text truncate">
                    {member.profiles?.full_name || member.email}
                  </p>
                  <p className="text-[10px] text-text-2 uppercase tracking-wider truncate">
                    {member.profiles?.role || member.role || "Operator"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-text">
          Operational Timeline
        </h2>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div
              className="
                rounded-[var(--radius-lg)]
                border border-border
                bg-surface
                p-6
                text-sm
                text-muted
                text-center
              "
            >
              No operational activity yet.
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="
                  rounded-[var(--radius-md)]
                  border border-border
                  bg-surface
                  p-4
                  hover:bg-surface-2
                  transition-colors
                  duration-200
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    justify-between
                    gap-2
                  "
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-accent mb-1">
                      {activity.type}
                    </p>
                    <h3 className="text-sm font-medium text-text leading-tight">
                      {activity.description}
                    </h3>
                  </div>

                  <div className="text-[10px] text-muted font-medium sm:text-right flex-shrink-0">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}