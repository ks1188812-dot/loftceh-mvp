
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export async function uploadBuffer(path: string, buffer: Buffer, contentType: string) {
  const { data, error } = await sb
    .storage
    .from(process.env.SUPABASE_BUCKET!)
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;
  const { data: pub } = sb.storage.from(process.env.SUPABASE_BUCKET!).getPublicUrl(path);
  return pub.publicUrl;
}
