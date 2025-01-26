SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
CREATE FUNCTION public.insert_auth_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO auth_users (user_id, user_email, all_is_auth)
    VALUES (NEW.id, NEW.email, false);
    RETURN NEW;
END;
$$;

CREATE TABLE public.auth_users (
    user_id integer NOT NULL,
    user_email text NOT NULL,
    all_is_auth boolean DEFAULT false NOT NULL
);

CREATE TABLE public.users (
    email text NOT NULL,
    password text NOT NULL,
    is_auth boolean DEFAULT false NOT NULL,
    id integer NOT NULL,
    CONSTRAINT user_email_check CHECK ((length(email) > 5))
);

CREATE TABLE auth_logins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    secret_code VARCHAR(255)
);

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_user_email_key UNIQUE (user_email);


ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_user_id_key UNIQUE (user_id);


ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

CREATE TRIGGER users_insert_trigger AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.insert_auth_user();

ALTER TABLE users
ADD COLUMN has_budget BOOLEAN DEFAULT FALSE;