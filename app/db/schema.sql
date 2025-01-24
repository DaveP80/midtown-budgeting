-- Table Triggers
create trigger on_message_created after
insert
    on
    public.messages for each row execute function handle_new_message();

CREATE OR REPLACE FUNCTION public.handle_new_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  declare user_data jsonb;
begin
  select raw_user_meta_data into user_data from auth.users where id = new.user_id for update;
  update public.messages set user_meta_data = jsonb_build_object('name', user_data ->> 'name', 'profile_image', user_data ->> 'avatar_url') where id = new.id;
  return new;
end;
$function$
;