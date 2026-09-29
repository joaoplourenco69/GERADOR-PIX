import { createClient } from '@supabase/supabase-js';

> API
const SUPABASE_URL = 'https://xlrczzpnadkozcyloscs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KWhOw6KiIShsrwT4m0CXIg_MShW5obl';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);