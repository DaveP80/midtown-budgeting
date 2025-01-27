import type { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { GlobalContext } from "~/context/globalcontext";
import midtownLogo from '~/money.png';

export const meta: MetaFunction = () => {
  return [{ title: "Personal Budgeting: Midtown" }];
};
export default function Index() {
  const UserContext = useContext(GlobalContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <img src={midtownLogo} alt="Midtown Budgeting" className="h-24 w-24 mb-8" />
      <h1 className="text-4xl font-bold mb-4">Welcome to Midtown Budgeting</h1>
      <p className="text-lg mb-4">A place where you can keep track of your finances</p>
      <div className="mb-4">
        {
          UserContext?.user?.id ?
            <Link to={`/profile/${UserContext.user.id}`} className="text-blue-500">Returning user, Go to the Dashboard</Link>
            :
            <div className="flex flex-col">
              <Link to="/auth/signup" className="text-blue-500">Don't have an account? Sign up here</Link>
            </div>
        }
      </div>
      <div className="mb-4">
        {!UserContext?.user?.id &&
          <Link to="/auth/login" className="text-blue-500">Returning Users, click here to log in</Link>
        }
      </div>
    </div>
  );
}
