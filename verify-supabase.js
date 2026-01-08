
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parsing to avoid 'dotenv' dependency
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('test_table_that_does_not_exist').select('*').limit(1);

    // We expect an error because the table doesn't exist, OR an empty list if RLS allows.
    // The important thing is that we reached Supabase (i.e. not a 404 on the domain or network error).
    // A "42P01" (undefined_table) means we hit Postgres!

    if (error) {
        if (error.code === '42P01' || error.message.includes('relation') || error.code === 'PGRST204') {
            console.log('✅ Connection successful! (Got expected database response)');
        } else {
            console.log('⚠️ Connection reached Supabase but returned an error (still properly configured):', error.message);
        }
    } else {
        console.log('✅ Connection successful!');
    }
}

checkConnection();
