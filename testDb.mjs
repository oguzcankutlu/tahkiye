import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bskbqkvhoxowoyxugkpd.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJza2Jxa3Zob3hvd295eHVna3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjMzNzEsImV4cCI6MjA4NzI5OTM3MX0.r3FkG2k5B-y8xTS4fmWJex81hUmt_8qvBtTHgrF2Rbw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function testInsert() {
    console.log("Testing insert into videos table...");
    const { data, error } = await supabase.from('videos').insert({
        title: "Test Video",
        video_url: "https://youtube.com/watch?v=123",
        thumbnail_url: "",
        category: "Girdi Videosu",
        topic_id: 1 // Using a dummy topic_id, replace if needed
    }).select();

    if (error) {
        console.error("Insert failed:", error);
    } else {
        console.log("Insert succeeded:", data);
    }
}

testInsert();
