import { Link, Outlet } from "@remix-run/react";
import { useContext } from "react";
import { GlobalContext } from "~/context/globalcontext";

export default function Index() {
    const UserContext = useContext(GlobalContext);

    return <>
        <h3>
            Welcome, This Website is secure with MFA, Sign Up to use all of the Budgeting features!
        </h3>
        <nav>
            {UserContext?.user?.id 
            ? <></> :
            <>
            <Link to="signup">SignUp</Link>
            <Link to="login">Login</Link>
            </>
            
            }
        </nav>
        <Outlet/>
    </>
}