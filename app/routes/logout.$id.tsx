import useLogout from "~/hooks/logout";

export async function action({ params }: any) {
  const id = params.id;
  if (!id) {
    throw new Response("Missing ID parameter", { status: 400 });
  } 
  return null;
}

export default function Logout() {
  return null;
}