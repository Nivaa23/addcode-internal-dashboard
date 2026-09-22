import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase.from('employees').select('*').limit(1);
  if (error) {
    console.error('Error fetching employees:', error);
  } else {
    console.log('Employee columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data in employees table');
  }
}
checkSchema();
