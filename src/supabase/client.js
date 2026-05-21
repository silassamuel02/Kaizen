import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("your_supabase_project_url"));

export const isDemoMode = !isSupabaseConfigured || localStorage.getItem("kaizen-demo-mode") === "true";

// Default mock user for Demo Mode
const defaultUser = {
  id: "demo-user-id-12345",
  email: "operator@kaizen.ai",
  user_metadata: { full_name: "Kaizen Operator" }
};

// Mock Database Helpers
function getMockDB() {
  let db = localStorage.getItem("kaizen_mock_db");
  if (!db) {
    const initialDB = {
      profiles: [
        {
          id: "demo-user-id-12345",
          email: "operator@kaizen.ai",
          full_name: "Kaizen Operator",
          avatar_url: "",
          created_at: new Date().toISOString()
        }
      ],
      workspaces: [
        {
          id: "ws-1",
          owner_id: "demo-user-id-12345",
          name: "Acme Corp Project",
          visibility: "private",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: "ws-2",
          owner_id: "demo-user-id-12345",
          name: "Personal Tasks",
          visibility: "private",
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ],
      memberships: [
        {
          id: "m-1",
          workspace_id: "ws-1",
          user_id: "demo-user-id-12345",
          role: "owner",
          joined_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ],
      notes: [
        {
          id: "note-1",
          owner_id: "demo-user-id-12345",
          workspace_id: "ws-1",
          title: "System Specifications",
          content: "This document tracks the KAIZEN design system specifications and tokens.\n\n- Primary Accent: Amber (var(--accent))\n- Theme Support: Dark and Light\n- Animation Style: Clean fading micro-interactions",
          status: "published",
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: "note-2",
          owner_id: "demo-user-id-12345",
          workspace_id: "ws-2",
          title: "Shopping List",
          content: "- Coffee Beans (Medium Roast)\n- Noise Cancelling Headphones\n- Notebook",
          status: "draft",
          created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 8).toISOString()
        }
      ],
      tasks: [
        {
          id: "task-1",
          workspace_id: "ws-1",
          title: "Implement Demo Mode Offline Bypass",
          description: "Create a fully local, localStorage-backed mock client for Supabase",
          priority: "high",
          status: "in-progress",
          assigned_to: "Kaizen Operator",
          due_date: new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "task-2",
          workspace_id: "ws-1",
          title: "Verify Responsive Sidebars",
          description: "Test hamburger menu layout on mobile and touch actions",
          priority: "medium",
          status: "todo",
          assigned_to: "Kaizen Operator",
          due_date: new Date(Date.now() + 3600000 * 48).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ],
      activities: [
        {
          id: "act-1",
          workspace_id: "ws-1",
          user_id: "demo-user-id-12345",
          type: "System Initialize",
          description: "KAIZEN Local Demo Workspace initialized successfully.",
          created_at: new Date(Date.now() - 3600000 * 10).toISOString()
        },
        {
          id: "act-2",
          workspace_id: "ws-1",
          user_id: "demo-user-id-12345",
          type: "Note Created",
          description: "Created System Specifications note.",
          created_at: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ],
      notifications: [
        {
          id: "not-1",
          workspace_id: "ws-1",
          title: "Welcome to KAIZEN",
          message: "Explore workspaces, notes, and tasks in Local Demo Mode.",
          type: "system",
          created_at: new Date().toISOString()
        }
      ]
    };
    localStorage.setItem("kaizen_mock_db", JSON.stringify(initialDB));
    return initialDB;
  }
  return JSON.parse(db);
}

function saveMockDB(db) {
  localStorage.setItem("kaizen_mock_db", JSON.stringify(db));
}

class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.orderConfig = null;
    this.limitCount = null;
    this.isSingle = false;
    this.isDelete = false;
    this.updateValues = null;
    this.resultData = null;
  }

  select(columns = "*") {
    return this;
  }

  insert(values) {
    const db = getMockDB();
    const rows = Array.isArray(values) ? values : [values];
    const newRows = rows.map(r => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: r.status || 'todo',
      ...r
    }));
    db[this.table] = [...(db[this.table] || []), ...newRows];
    saveMockDB(db);
    this.resultData = newRows;
    return this;
  }

  update(values) {
    this.updateValues = values;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  eq(column, value) {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  or(filterString) {
    // Custom filter for workspace get: owner_id.eq.X,memberships.user_id.eq.X
    this.filters.push((row) => {
      if (this.table === 'workspaces') {
        const db = getMockDB();
        const memberships = db.memberships || [];
        const isMember = memberships.some(m => m.workspace_id === row.id && m.user_id === defaultUser.id);
        return row.owner_id === defaultUser.id || isMember;
      }
      return true;
    });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderConfig = { column, ascending };
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  // Thenable for await support
  async then(onfulfilled, onrejected) {
    try {
      const res = await this.execute();
      return onfulfilled(res);
    } catch (err) {
      if (onrejected) return onrejected(err);
      return onfulfilled({ data: null, error: err });
    }
  }

  async execute() {
    const db = getMockDB();
    let data = db[this.table] || [];

    // Apply deletes
    if (this.isDelete) {
      data = data.filter(row => !this.filters.every(f => f(row)));
      db[this.table] = data;
      saveMockDB(db);
      return { data: null, error: null };
    }

    // Apply updates
    if (this.updateValues) {
      data = data.map(row => {
        if (this.filters.length === 0 || this.filters.every(f => f(row))) {
          return { ...row, ...this.updateValues, updated_at: new Date().toISOString() };
        }
        return row;
      });
      db[this.table] = data;
      saveMockDB(db);
      const updatedRows = data.filter(row => this.filters.length === 0 || this.filters.every(f => f(row)));
      return { data: this.isSingle ? (updatedRows[0] || null) : updatedRows, error: null };
    }

    // Apply select filters
    if (this.filters.length > 0) {
      data = data.filter(row => this.filters.every(f => f(row)));
    }

    // Apply ordering
    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig;
      data = [...data].sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    // Return inserted rows if insert was run
    if (this.resultData) {
      data = this.resultData;
    }

    const result = this.isSingle ? (data[0] || null) : data;
    return { data: result, error: null };
  }
}

// Storage Mock Client
const mockStorage = {
  from: () => ({
    upload: async (path, file) => ({ data: { path }, error: null }),
    getPublicUrl: (path) => ({ data: { publicUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80` } }),
    remove: async (paths) => ({ data: null, error: null }),
  })
};

// Mock Realtime Channel
const mockChannel = {
  on: () => mockChannel,
  subscribe: () => mockChannel,
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => {
          const isDemo = localStorage.getItem("kaizen-demo-mode") === "true";
          return { data: { session: isDemo ? { user: defaultUser } : null }, error: null };
        },
        onAuthStateChange: (callback) => {
          const isDemo = localStorage.getItem("kaizen-demo-mode") === "true";
          if (isDemo) {
            // Delay slightly to trigger in React lifecycle
            setTimeout(() => {
              callback("SIGNED_IN", { user: defaultUser });
            }, 0);
          }
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signInWithPassword: async ({ email, password }) => {
          localStorage.setItem("kaizen-demo-mode", "true");
          return { error: null, data: { user: defaultUser } };
        },
        signUp: async ({ email, password }) => {
          localStorage.setItem("kaizen-demo-mode", "true");
          return { error: null, data: { user: defaultUser } };
        },
        signOut: async () => {
          localStorage.removeItem("kaizen-demo-mode");
          return { error: null };
        },
        resetPasswordForEmail: async (email) => ({ error: null }),
      },
      from: (table) => new MockQueryBuilder(table),
      storage: mockStorage,
      channel: () => mockChannel,
      removeChannel: () => {},
    };