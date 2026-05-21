import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

export default function FileUploadPanel({ workspaceId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [workspaceId]);

  async function fetchFiles() {
    const { data } = await supabase
      .from("workspace_files")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    setFiles(data || []);
  }

  async function uploadFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const filePath = `${workspaceId}/${Date.now()}-${file.name}`;

    try {
      await supabase.storage
        .from("workspace-files")
        .upload(filePath, file);

      const { data: publicUrlData } = supabase.storage
        .from("workspace-files")
        .getPublicUrl(filePath);

      await supabase
        .from("workspace_files")
        .insert([
          {
            workspace_id: workspaceId,
            name: file.name,
            url: publicUrlData.publicUrl,
          },
        ]);

      await supabase
        .from("notifications")
        .insert([
          {
            workspace_id: workspaceId,
            title: "New File Uploaded",
            message: `${file.name} was uploaded.`,
            type: "file",
          },
        ]);

      fetchFiles();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
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
          Workspace Assets
        </p>
        <h2
          className="
            text-xl
            font-bold
            tracking-tight
            text-text
          "
        >
          File Uploads
        </h2>
      </div>

      {/* Sleek Custom Upload Zone */}
      <label
        className="
          flex flex-col items-center justify-center border border-dashed border-border
          hover:border-accent hover:bg-accent-soft rounded-[var(--radius-md)] p-6 cursor-pointer
          transition-all duration-200 text-center
        "
      >
        <span className="text-sm font-semibold text-text mb-0.5">Upload File</span>
        <span className="text-[11px] text-muted">Click to browse workspace assets</span>
        <input type="file" onChange={uploadFile} className="hidden" />
      </label>

      {uploading && (
        <div className="flex items-center gap-2 text-xs text-text-2 justify-center">
          <span className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin border-border-medium border-t-accent" />
          <span>Uploading asset to secure storage...</span>
        </div>
      )}

      <div className="space-y-2">
        {files.length === 0 ? (
          <div className="text-xs text-muted text-center py-2">
            No uploaded files yet.
          </div>
        ) : (
          files.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center justify-between gap-4 p-3.5 rounded-[var(--radius-md)]
                border border-border bg-surface-2 hover:bg-surface-3 transition-colors duration-200
              "
            >
              <h3 className="text-xs font-medium text-text truncate max-w-[200px]">
                {file.name}
              </h3>
              <span className="text-[10px] text-accent font-bold uppercase tracking-wider hover:underline flex-shrink-0">
                View
              </span>
            </a>
          ))
        )}
      </div>
    </section>
  );
}