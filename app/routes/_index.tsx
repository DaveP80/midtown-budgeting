import type { MetaFunction } from "@remix-run/node";


export const meta: MetaFunction = () => {
  return [{ title: "Personal Budgeting: Midtown" }];
};

export default function Index() {
  return (
    <>
        <div className="container mx-auto md:w-[800px]">
          Midtown Budget Program, a personal touch to your money.
        </div>
    </>
  );
}
