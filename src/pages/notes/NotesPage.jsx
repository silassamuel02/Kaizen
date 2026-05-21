import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { logActivity } from '../../utils/logActivity';
import { Plus, Trash2, FileText } from 'lucide-react';

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes]     = useState([]);
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
    const channel = supabase
      .channel('notes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, fetchNotes)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchNotes() {
    const { data, error } = await supabase
      .from('notes').select('*').order('created_at', { ascending: false });
    if (!error) setNotes(data || []);
  }

  async function createNote() {
    if (!title.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('notes').insert([{ user_id: user.id, title, content }]);
    if (!error) { setTitle(''); setContent(''); fetchNotes(); }
    setLoading(false);
  }

  async function deleteNote(id) {
    await supabase.from('notes').delete().eq('id', id);
    fetchNotes();
  }

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Page Header */}
      <div>
        <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>Workspace</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Notes
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
          Capture operational insights and build your knowledge base.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Create Panel */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <h2 className="text-base font-semibold mb-5"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
              New Note
            </h2>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Note title…"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label style={{ color: 'var(--text-2)', fontSize: '11px', letterSpacing: '0.1em' }}
                  className="font-semibold uppercase">
                  Content
                </label>
                <textarea
                  placeholder="Write your note…"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={6}
                  className="input-base resize-none"
                />
              </div>
              <Button variant="primary" size="md" onClick={createNote}
                loading={loading} disabled={!title.trim()} className="w-full">
                <Plus size={14} /> {loading ? 'Saving…' : 'Create Note'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Notes Grid */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <EmptyState
              title="No notes yet"
              description="Create your first note to start capturing operational insights."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.map(note => (
                <div key={note.id} className="group relative rounded-[var(--radius-lg)] overflow-hidden
                  transition-all duration-250 hover:-translate-y-px hover:shadow-theme"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                  {/* accent top line */}
                  <div className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <h3 className="text-sm font-semibold truncate"
                          style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
                          {note.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="flex-shrink-0 flex items-center justify-center w-7 h-7
                          rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100
                          transition-all duration-200 hover:bg-[var(--danger-soft)]"
                        style={{ color: 'var(--danger)' }}
                        aria-label="Delete note">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {note.content && (
                      <p className="text-sm leading-relaxed line-clamp-4"
                        style={{ color: 'var(--text-2)' }}>
                        {note.content}
                      </p>
                    )}
                    <p className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
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