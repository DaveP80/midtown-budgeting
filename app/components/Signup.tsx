import { Form } from "@remix-run/react"

export default function Signup({ errors, message }: { errors: { isPwdErr: boolean, pwdStrengthErr: boolean, isEmailErr: boolean }, message: any  }) {

   return <>
   <Form method="post">
        <label htmlFor="email">email:</label>
        <input name="email" type="email" />
        {errors.isEmailErr && <p>Email must be alphanumeric longer than 4 characters.</p>}
        <label htmlFor="password">password:</label>
        <input name="password" type="password" />
        <div className="error-message">
            {errors.isPwdErr && <p>Password must be alphanumeric longer than 7 characters.</p>}
            {errors.pwdStrengthErr && <p>Password must contain at least one UpperCase character.</p>}
        </div>
            <button type="submit">Sign Up</button>
        </Form>
        {message.message || ""}
   </>
};