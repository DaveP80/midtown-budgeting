import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react"
import { useContext, useEffect } from "react"
import { GlobalContext } from "~/context/globalcontext"
import { tableExists } from "~/utils/queries/budget.server"

export async function loader({request, params}: LoaderFunctionArgs) {
  const checkUserBudget = await tableExists(params?.id || -1);
  console.log(checkUserBudget)
    return Response.json({ ok: checkUserBudget.ok })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
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
      {
        !loaderData?.ok ? <Link to={`makebudget/${UserContext?.user?.id}`}>Start Tracking your Finances Now!</Link> :
        <Link to={`yourdata`}>See your Current Budget Balances!</Link>
      }

      <Outlet />
    </div>
  )
};