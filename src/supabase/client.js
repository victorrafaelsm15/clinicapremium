import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tevrcdloiwgswtfgqnlf.supabase.co";
const supabaseKey = "sb_publishable_TqEypsn5eib_3GPqGvQfHw_pKMPcV59";

export const supabase = createClient(supabaseUrl, supabaseKey);