import { Link, Outlet } from "@remix-run/react";
import { useContext } from "react";
import { GlobalContext } from "~/context/globalcontext";

export default function Index() {
    const UserContext = useContext(GlobalContext);

    return <div className="bg-gray-300 flex flex-col min-h-screen">
        <header className="container text-dark py-4 px-8 mx-auto text-center">
            <h3>Welcome, This Website is secure with MFA, Sign Up to use all of the Budgeting features!</h3>
        </header>
        <nav className="bg-gray-200 py-4 px-8 text-center">
            {UserContext?.user?.id
                ? <h3>You are actively logged in.</h3>
                : (
                    <section>
                        <Link to="signup" className="text-blue-600 mr-4">SignUp</Link>
                        <Link to="login" className="text-green-600">Login</Link>
                    </section>
                )}
        </nav>
        <div className="flex-1">
                <Outlet />
        </div>
    </div>
}