import { Form } from '@remix-run/react'

function ChangePwd({errors, status}: {errors: {isPwdErr: boolean, pwdStrengthErr: boolean}, status: {message: string, id: string | number, ok: boolean}}) {
  return (
    <div className="max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
    <Form method="post" action={`/profile/${status.id}/pwdchange/${status.id}`}className="flex flex-col space-y-4">
    <label htmlFor="old_password">old password:</label>
    <input name="old_password" type="password" className="border border-gray-300 rounded-md p-2"/>
    <label htmlFor="new_password">new password:</label>
    <input name="new_password" type="password" className="border border-gray-300 rounded-md p-2"/>
    <div className="pwd-change-error-message">
    {errors.isPwdErr && <p>Password must be alphanumeric longer than 7 characters.</p>}
    {errors.pwdStrengthErr && <p>Password must contain at least one UpperCase character.</p>}
    </div>
    <button type="submit" className="bg-green-500 text-white py-2 rounded-md">Change Password</button>
    <div className="pwd-change-messages">
    {status.message || ""}
    </div>
  </Form>
    </div>
  )
}

export default ChangePwd