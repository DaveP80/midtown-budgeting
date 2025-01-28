import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react"
import { useContext, useEffect } from "react"
import { GlobalContext } from "~/context/globalcontext"
import { tableExists } from "~/utils/queries/budget.server"

export async function loader({ request, params }: LoaderFunctionArgs) {

  const checkUserBudget = await tableExists(params?.id || -1);
  if (!checkUserBudget.ok) {
    return redirect("/auth")
  }
  return Response.json({ ok: checkUserBudget.ok, data: checkUserBudget.data })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const { id } = useParams();
  const UserContext = useContext(GlobalContext);
  useEffect(() => {
    if (id && loaderData.data) {
      UserContext?.setUser({ id, email: loaderData.data[0]?.email || "" })
    }
  }, [id, loaderData])

  return (
    <div className="bg-gray-300 flex flex-col min-h-screen">
      <header className="container text-dark py-4 mx-auto text-center">
        <h1 className="text-lg">
          Welcome {UserContext?.user?.email}
        </h1>
      </header>
      <nav className="bg-gray-200 py-4 xs:px-1 md:px-8 text-center md:flex xs:flex-col justify-center">
        <Link to={`pwdchange/${UserContext?.user?.id}`} className="text-black mr-4 transition duration-300 ease-in-out transform hover:scale-105">Change Password</Link>
        {!loaderData?.ok ?
          <Link to={`makebudget/${UserContext?.user?.id}`} className="text-green-500 font-bold transition duration-300 ease-in-out transform hover:scale-105">Start Tracking your Finances Now!</Link> :
          <Link to={`yourdata`} id="your_data_link" className="text-green-500 font-bold transition duration-300 ease-in-out transform hover:scale-105">See your Current Budget Balances!</Link>
        }
      </nav>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
};