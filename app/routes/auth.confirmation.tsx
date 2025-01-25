import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { checkNewUser } from '~/utils/middleware/newuser.server';
import { authLogin } from '~/utils/queries/users.server';

export async function loader({ request }: LoaderFunctionArgs) {
    const token = new URL(request.url).searchParams.get('k');
    let uID;

    if (!token) {
        return Response.json({ error: 'Token is missing' });
    }
    else {
        try {
            uID = await authLogin(checkNewUser(token));
        } catch {
            return Response.json({ error: 'Broken token string' });
        }
    }
    return Response.json({ message: uID, ok: true });
};

export default function Confirmation() {
    const data = useLoaderData<typeof loader>();

    return <div>{data?.ok ? <h3>You have confirmed email on sign up! Please log in with the password you created. MFA is active now</h3> : <h3>Something went wrong.</h3>}</div>;
}