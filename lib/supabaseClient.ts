import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nvdibztptczjckxalejt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZGlienRwdGN6amNreGFsZWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDU2MDYsImV4cCI6MjA4MDgyMTYwNn0.HlWKVFLygxNytRE02wpmxWkfUWSL8KvYY6BKwPIWMbI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
