-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  research_mode BOOLEAN DEFAULT FALSE
);

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompt Analytics
CREATE TABLE IF NOT EXISTS public.prompt_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  pss INTEGER,
  mit INTEGER,
  tokens INTEGER,
  energy DECIMAL(10,4),
  water DECIMAL(10,4),
  carbon DECIMAL(10,4),
  gaei INTEGER,
  selected_model TEXT,
  routing_savings DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimization History
CREATE TABLE IF NOT EXISTS public.optimization_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  pss_before INTEGER,
  pss_after INTEGER,
  gaei_before INTEGER,
  gaei_after INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research Exports
CREATE TABLE IF NOT EXISTS public.research_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON public.messages FOR ALL USING (
  conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own analytics" ON public.prompt_analytics FOR ALL USING (
  message_id IN (SELECT m.id FROM public.messages m JOIN public.conversations c ON m.conversation_id = c.id WHERE c.user_id = auth.uid())
);
CREATE POLICY "Users can view own optimizations" ON public.optimization_history FOR ALL USING (
  message_id IN (SELECT m.id FROM public.messages m JOIN public.conversations c ON m.conversation_id = c.id WHERE c.user_id = auth.uid())
);
CREATE POLICY "Users can manage own exports" ON public.research_exports FOR ALL USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
