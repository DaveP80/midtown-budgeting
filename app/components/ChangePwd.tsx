import { Form, useFetcher } from '@remix-run/react'

function ChangePwd({errors, status}: {errors: {isPwdErr: boolean}, status: {message: string, id: string | number, ok: boolean}}) {
    const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action={`/profile/${status.id}/pwdchange/${status.id}`}>
    <label htmlFor="old_password">old password:</label>
    <input name="old_password" type="password" />
    <label htmlFor="new_password">new password:</label>
    <input name="new_password" type="password" />
    {errors.isPwdErr && <p>Password must be alphanumeric longer than 4 characters.</p>}
    <button type="submit">Change Password</button>
    {status.message || ""}
  </fetcher.Form>
  )
}

export default ChangePwd