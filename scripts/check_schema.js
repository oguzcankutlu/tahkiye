const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    // We can't query information_schema from rpc directly without a custom function,
    // but we can try just inserting a topic with a uuid category_id and catch the error
    // Alternatively, I'll fetch the OpenAPI spec of supabase:

    const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
    const spec = await res.json();
    console.log(JSON.stringify(spec.definitions.topics.properties, null, 2));
}

checkSchema().catch(console.error);
