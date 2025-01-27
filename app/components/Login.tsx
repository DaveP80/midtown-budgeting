import { Form } from "@remix-run/react";

export function Login({ errors, status }: { errors: any, status: { message: string, id: string | number, ok: boolean } }) {

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <Form className="flex flex-col space-y-4" method="post">
        <label htmlFor="email">Email:</label>
        <input name="email" type="email" className="border border-gray-300 rounded-md p-2" required/>
        {errors.isEmailErr && <p className="text-red-500">Email must be alphanumeric longer than 4 characters.</p>}
        <label htmlFor="password">Password:</label>
        <input name="password" type="password" className="border border-gray-300 rounded-md p-2"/>
        <div className="login-error-message">
        {errors.isPwdErr && <p className="text-red-500">Password must be alphanumeric longer than 4 characters.</p>}
        </div>
        <button type="submit" disabled={status?.ok ? true : false} className="bg-green-500 text-white py-2 rounded-md">Login</button>
      </Form>
      <aside className="text-center">
      {status.message || ""}
      </aside>
      {
        status?.ok && <div>
          <div className="confirm-message text-center text-pretty">
          A 4 digit code has been sent to your email, please confirm to proceed.
          </div>
          <Form method="post" className="flex flex-col space-y-4" action={`/auth/verify/${status.id}`}>
            <label htmlFor="Code">Enter 4 digit Code:</label>
            <input name="Code" type="text" className="border border-gray-300 rounded-md p-2"/>
            <button name="mfa-button" type="submit" className="bg-green-500 text-white py-2 rounded-md">Enter</button>
          </Form>
        </div>
      }
    </div>
  );
};
