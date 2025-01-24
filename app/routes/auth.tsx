import { Link, Outlet } from "@remix-run/react";

export default function Index() {

    return <>
        <h3>
            Welcome, This Website is secure with MFA, Sign Up to use all of the Budgeting features!
        </h3>
        <nav>
            <Link to="signup">SignUp</Link>
            <Link to="login">Login</Link>
        </nav>
        <Outlet/>
    </>
}