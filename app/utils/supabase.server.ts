import { createServerClient } from "@supabase/auth-helpers-remix";

export const createSupabaseServerClient = ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
    return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_PUBLIC_KEY!,
    { request, response }
  );
}