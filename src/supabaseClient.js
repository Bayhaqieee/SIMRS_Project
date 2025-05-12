import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yoinqidcssgwdynroopi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaW5xaWRjc3Nnd2R5bnJvb3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDgwMTEsImV4cCI6MjA2MTk4NDAxMX0.a0obPUnmSi0rKqX2gAJKP00rLyDeU1jW6YEURxFLQpM";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
