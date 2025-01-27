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
      UserContext?.setUser({ id })
    } 
  }, [id])

  return (
    <div className="bg-gray-300 flex flex-col min-h-screen">
        <header className="container text-dark py-4 mx-auto text-center">
            <h1 className="text-lg">
              Welcome {UserContext?.user?.name}
              </h1>
        </header>
        <nav className="bg-gray-200 py-4 xs:px-1 md:px-8 text-center md:flex xs:flex-col justify-center">
            <Link to={`pwdchange/${UserContext?.user?.id}`} className="text-black mr-4">Change Password</Link>
            {!loaderData?.ok ? 
                <Link to={`makebudget/${UserContext?.user?.id}`} className="text-green-500 font-bold">Start Tracking your Finances Now!</Link> :
                <Link to={`yourdata`} className="text-green-500 font-bold your_data_link">See your Current Budget Balances!</Link>
            }
        </nav>
        <div className="">
            <Outlet />
        </div>
</div>
  )
};