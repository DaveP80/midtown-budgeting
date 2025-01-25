import { Link, Outlet, useParams } from "@remix-run/react"
import { useContext, useEffect } from "react"
import { GlobalContext } from "~/context/globalcontext"

export async function loader() {
  return Response.json({ status: 200 })
}

export default function Index() {
  const { id } = useParams();
  const UserContext = useContext(GlobalContext);
  useEffect(() => {
    if (id) {
      UserContext.setUser({ id })
    } 
  }, [id])

  return (
    <div>Welcome user
      <Link to={`pwdchange/${UserContext?.user?.id}`}>Change Password</Link>

      <Outlet />


    </div>
  )
};