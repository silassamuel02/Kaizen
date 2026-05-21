-- KAIZEN Supabase schema planning

-- Profiles store user metadata and workspace membership.
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Core workspace records.
create table if not exists workspaces (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id),
  name text not null,
  visibility text default 'private',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Membership joins users and workspaces.
create table if not exists memberships (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) not null,
  user_id uuid references profiles(id) not null,
  role text default 'member',
  joined_at timestamp with time zone default now()
);

-- Notes are core content items owned by a user.
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) not null,
  workspace_id uuid references workspaces(id),
  title text not null,
  content text not null,
  status text default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Activity feed for realtime updates and history tracking.
create table if not exists activities (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) not null,
  user_id uuid references profiles(id) not null,
  type text not null,
  message text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- AI logs store observations and analysis records.
create table if not exists ai_logs (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id),
  user_id uuid references profiles(id),
  prompt text,
  response text,
  category text,
  created_at timestamp with time zone default now()
);
