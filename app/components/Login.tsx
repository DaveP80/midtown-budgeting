import { Form, useFetcher } from "@remix-run/react";

export const Login = ({ errors, status }: { errors: any, status: { message: string, id: string | number, ok: boolean } }) => {

  return (
    <>
      <Form method="post">
        <label htmlFor="email">email:</label>
        <input name="email" type="email" />
        {errors.isEmailErr && <p>Email must be alphanumeric longer than 4 characters.</p>}
        <label htmlFor="password">password:</label>
        <input name="password" type="password" />
        {errors.isPwdErr && <p>Password must be alphanumeric longer than 4 characters.</p>}
        <button type="submit">Login</button>
      </Form>
      {status.message || ""}
      {
        status?.ok && <div>
          A 4 digit code has been sent to your email, please confirm to proceed.
          <Form method="post" action={`/auth/verify/${status.id}`}>
            <label htmlFor="Code">Enter 4 digit Code:</label>
            <input name="Code" type="text" />
            <button type="submit">Enter</button>
          </Form>
        </div>
      }
    </>
  );
};
