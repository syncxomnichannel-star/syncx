import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://mccnykxameoakngjhxpx.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_xDdb_Vq--7IyraJiqSI4xw_ebiaJSda';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
