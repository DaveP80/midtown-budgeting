import type { MetaFunction } from "@remix-run/node";
import {
  Link,
  useOutletContext,
} from "@remix-run/react";
import { OutletContext } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Personal Budgeting: Midtown" }];
};

export default function Index() {
  const { session } = useOutletContext<OutletContext>();
  return (
    <>
      {!session?.user ? (
        <Link to="/auth" />
      ) : (
        <div className="container mx-auto md:w-[800px]">
          Midtown Budget Program, a personal touch to your money.
          <h3>{session.user.user_metadata.name}</h3>
        </div>
      )}
    </>
  );
}
