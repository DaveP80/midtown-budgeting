import { Form } from "@remix-run/react"

export default function Signup({ errors, message }: { errors: { isPwdErr: boolean, pwdStrengthErr: boolean, isEmailErr: boolean }, message: any }) {

    return <div className="max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
        <Form className="flex flex-col space-y-4" method="post">
            <label htmlFor="email">Email:</label>
            <input name="email" type="email" className="border border-gray-300 rounded-md p-2" required />
            {errors.isEmailErr && <p className="text-red-500">Email must be alphanumeric and longer than 4 characters.</p>}
            <label htmlFor="password">Password:</label>
            <input name="password" type="password" className="border border-gray-300 rounded-md p-2" />
            <div className="error-message">
                {errors.isPwdErr && <p className="text-red-500">Password must be alphanumeric and longer than 7 characters.</p>}
                {errors.pwdStrengthErr && <p className="text-red-500">Password must contain at least one UpperCase character.</p>}
            </div>
            <button type="submit" className="bg-green-500 text-white py-2 rounded-md">Sign Up</button>
        </Form>
        <p className="mt-4 text-center text-gray-500">{message.message || ""}</p>
    </div>
};