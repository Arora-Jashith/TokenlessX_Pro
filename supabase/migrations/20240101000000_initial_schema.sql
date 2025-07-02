-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  name text,
  avatar_url text,
  reputation integer default 100,
  trust_score integer default 50,
  balance decimal default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  recipient_id uuid references public.profiles(id) not null,
  amount decimal not null,
  status text not null check (status in ('pending', 'approved', 'rejected', 'flagged', 'under_review')),
  hash text unique not null,
  trust_points_earned integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.trust_network (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  connection_id uuid references public.profiles(id) not null,
  trust_score integer default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, connection_id)
);

-- Create functions
create or replace function public.calculate_trust_score(user_id uuid)
returns integer as $$
declare
  base_score integer := 50;
  reputation_bonus integer;
  transaction_bonus integer;
  network_bonus integer;
  final_score integer;
begin
  -- Calculate reputation bonus
  select coalesce(reputation * 0.2, 0) into reputation_bonus
  from public.profiles
  where id = user_id;

  -- Calculate transaction bonus
  select coalesce(
    (select count(*) * 2 from public.transactions 
     where (sender_id = user_id or recipient_id = user_id) 
     and status = 'approved'), 0
  ) into transaction_bonus;

  -- Calculate network bonus
  select coalesce(
    (select avg(trust_score) * 0.3 from public.trust_network 
     where user_id = user_id), 0
  ) into network_bonus;

  -- Calculate final score
  final_score := base_score + reputation_bonus + transaction_bonus + network_bonus;
  
  -- Ensure score is between 0 and 100
  return least(greatest(final_score, 0), 100);
end;
$$ language plpgsql security definer;

create or replace function public.process_transaction(
  sender_id uuid,
  recipient_id uuid,
  amount decimal
)
returns json as $$
declare
  sender_balance decimal;
  transaction_hash text;
  result json;
begin
  -- Check sender's balance
  select balance into sender_balance
  from public.profiles
  where id = sender_id;

  if sender_balance < amount then
    return json_build_object(
      'success', false,
      'message', 'Insufficient funds'
    );
  end if;

  -- Generate transaction hash
  transaction_hash := encode(
    digest(
      concat(
        sender_id::text,
        recipient_id::text,
        amount::text,
        now()::text
      ),
      'sha256'
    ),
    'hex'
  );

  -- Create transaction
  insert into public.transactions (
    sender_id,
    recipient_id,
    amount,
    status,
    hash
  ) values (
    sender_id,
    recipient_id,
    amount,
    'pending',
    transaction_hash
  );

  return json_build_object(
    'success', true,
    'message', 'Transaction created successfully',
    'hash', transaction_hash
  );
end;
$$ language plpgsql security definer;

-- Create triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_trust_score()
returns trigger as $$
begin
  update public.profiles
  set trust_score = public.calculate_trust_score(new.user_id),
      updated_at = now()
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_trust_network_update
  after insert or update on public.trust_network
  for each row execute procedure public.update_trust_score();

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.trust_network enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can view their own transactions"
  on public.transactions for select
  using ( auth.uid() = sender_id or auth.uid() = recipient_id );

create policy "Users can create transactions"
  on public.transactions for insert
  with check ( auth.uid() = sender_id );

create policy "Users can view their own trust network"
  on public.trust_network for select
  using ( auth.uid() = user_id );

create policy "Users can manage their own trust network"
  on public.trust_network for all
  using ( auth.uid() = user_id ); 