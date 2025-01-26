import { Form } from '@remix-run/react'

function ChangePwd({errors, status}: {errors: {isPwdErr: boolean, pwdStrengthErr: boolean}, status: {message: string, id: string | number, ok: boolean}}) {
  return (
    <Form method="post" action={`/profile/${status.id}/pwdchange/${status.id}`}>
    <label htmlFor="old_password">old password:</label>
    <input name="old_password" type="password" />
    <label htmlFor="new_password">new password:</label>
    <input name="new_password" type="password" />
    {errors.isPwdErr && <p>Password must be alphanumeric longer than 7 characters.</p>}
    {errors.pwdStrengthErr && <p>Password must contain at least one UpperCase character.</p>}
    <button type="submit">Change Password</button>
    {status.message || ""}
  </Form>
  )
}

export default ChangePwd