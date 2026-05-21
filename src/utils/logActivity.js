import { supabase } from "../supabase/client";

export async function logActivity({
  userId,
  type,
  description,
}) {

  await supabase
    .from("activities")
    .insert([
      {
        user_id: userId,
        type,
        description,
      },
    ]);
}