import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dgbsumxbppzudhfnmrdm.supabase.co',
  'sb_publishable_xpnIT5HTtfHCCBlDmHLu8w_4krQGdvV'
);

async function main() {
  const { data, error } = await supabase.from('work_sessions').select('*').limit(1);
  if (error) {
    console.error('Error fetching work_sessions:', error);
  } else {
    console.log('Work sessions table is accessible.');
  }
}
main();
