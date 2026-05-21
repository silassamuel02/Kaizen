import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { logActivity } from '../../utils/logActivity';
import WorkspaceMembers from '../../components/workspace/WorkspaceMembers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import SearchBar from '../../components/ui/SearchBar';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';

export default function WorkspacePage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    fetchWorkspaces();
    const channel = supabase
      .channel('workspaces-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workspaces' }, () => {
        fetchWorkspaces();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchWorkspaces() {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setWorkspaces(data || []);
  }

  async function createWorkspace() {
    if (!name.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('workspaces')
      .insert([{ user_id: user.id, name, description }]);

    if (!error) {
      await logActivity({ userId: user.id, type: 'Workspace Created', description: `Created workspace: ${name}` });
      addNotification({ title: 'Workspace Created', message: `${name} initialized successfully.` });
      setName('');
      setDescription('');
      fetchWorkspaces();
    }
    setLoading(false);
  }

  async function deleteWorkspace(id) {
    await supabase.from('workspaces').delete().eq('id', id);
    fetchWorkspaces();
  }

  const filtered = workspaces.filter((w) =>
    w.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-slide">

      {/* ── Page Header ── */}
      <div>
        <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>
          Operations
        </p>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
        >
          Workspaces
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
          Build collaborative environments powered by realtime synchronization.
        </p>
      </div>

      {/* ── Main Layout: Create + Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">

        {/* ── Create Form (sticks on desktop) ── */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <h2
              className="text-base font-semibold mb-5"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              New Workspace
            </h2>

            <div className="space-y-4">
              <Input
                label="Workspace Name"
                placeholder="e.g. Product Operations"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label
                  style={{ color: 'var(--text-2)', fontSize: '11px', letterSpacing: '0.1em' }}
                  className="font-semibold uppercase"
                >
                  Description
                </label>
                <textarea
                  placeholder="What is this workspace for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="input-base resize-none"
                  style={{ borderRadius: 'var(--radius)' }}
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={createWorkspace}
                loading={loading}
                disabled={!name.trim()}
                className="w-full"
              >
                <Plus size={14} />
                {loading ? 'Creating…' : 'Create Workspace'}
              </Button>
            </div>
          </Card>
        </div>

        {/* ── Workspaces List ── */}
        <div className="space-y-4">

          {/* Search */}
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspaces…"
          />

          {/* Count */}
          {filtered.length > 0 && (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              {filtered.length} workspace{filtered.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Empty */}
          {filtered.length === 0 ? (
            <EmptyState
              title="No workspaces yet"
              description="Create your first workspace to start building collaborative environments."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
              {filtered.map((workspace) => (
                <div
                  key={workspace.id}
                  className="group relative rounded-[var(--radius-lg)] overflow-hidden transition-all duration-250 hover:-translate-y-px hover:shadow-theme"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {/* Accent left bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-200"
                    style={{ backgroundColor: 'var(--accent-soft)' }}
                  />

                  <div className="p-5 pl-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="label-overline mb-1.5" style={{ color: 'var(--accent)', opacity: 0.7 }}>
                          Workspace
                        </p>
                        <h3
                          className="text-base font-semibold truncate"
                          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
                        >
                          {workspace.name}
                        </h3>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.preventDefault(); deleteWorkspace(workspace.id); }}
                        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[var(--danger-soft)]"
                        style={{ color: 'var(--danger)' }}
                        aria-label="Delete workspace"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p
                      className="text-sm leading-relaxed mb-4 line-clamp-2"
                      style={{ color: 'var(--text-2)' }}
                    >
                      {workspace.description || 'No description provided.'}
                    </p>

                    <div
                      className="flex items-center justify-between pt-4"
                      style={{ borderTop: '1px solid var(--border-soft)' }}
                    >
                      <WorkspaceMembers
                        members={[{ name: 'Alex' }, { name: 'Nova' }, { name: 'Kai' }]}
                      />
                      <Link
                        to={`/workspace/${workspace.id}`}
                        className="flex items-center gap-1 text-xs font-medium transition-colors duration-200"
                        style={{ color: 'var(--accent)' }}
                      >
                        Open
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}