SET search_path = pgtap, public;
BEGIN;

CREATE TABLE public.auth_users (
    user_id integer NOT NULL,
    user_email text NOT NULL,
    all_is_auth boolean DEFAULT false NOT NULL
);

CREATE TABLE public.users (
    email text NOT NULL unique,
    password text NOT NULL,
    is_auth boolean DEFAULT false NOT NULL,
    id serial primary key,
    CONSTRAINT user_email_check CHECK ((length(email) > 5))
);


ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_user_email_key UNIQUE (user_email);


ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_user_id_key UNIQUE (user_id);


ALTER TABLE users
ADD COLUMN has_budget BOOLEAN DEFAULT FALSE;

CREATE FUNCTION public.insert_auth_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO auth_users (user_id, user_email, all_is_auth)
    VALUES (NEW.id, NEW.email, false);
    RETURN NEW;
END;
$$;

CREATE TRIGGER users_insert_trigger AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.insert_auth_user();

SELECT plan(1);
INSERT INTO users(email, password) VALUES (myemail@example.com, ffwjf938834393j3d9);
SELECT has_row('auth_users', 'user_id = (SELECT id from users WHERE email = ''myemail@example.com'')', 'Trigger should enter new user on two tables');
SELECT * FROM finish();
ROLLBACK;
