import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import Navigation from "./components/Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { createSupabaseServerClient } from "./utils/supabase.server";
import "./tailwind.css"

export const loader = async ({ request }: any) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return Response.json({ session }, {
    headers: response.headers
  });
};

export function ErrorBoundary() {
  useRouteError();
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <Link to="/">Go to Login and Dashboard</Link>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  const [supabase] = useState(() =>
    createBrowserClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLIC_KEY)
  );
  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        revalidate();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, serverAccessToken, revalidate]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navigation context={{ supabase, session }} />
        <Outlet context={{ supabase, session }} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
