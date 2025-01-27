function About() {
    return (
<div className="bg-gray-120 p-8">
    <div className="max-w-2xl mx-auto">
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Flow:</h2>
            <ul className="list-disc pl-6">
                <li>MFA: New users must sign up with a password and email. Subsequent logins require the user to check their email for a login code.</li>
                <li>Failed Login Attempt Notification: If there is a failed attempt with submitting a login code, the user is notified with an email.</li>
                <li>Password Change: Users can change their password, provided they can prove they know their old password. Upon successful password change, the user is notified with an email.</li>
            </ul>
        </section>
        <section>
            <h2 className="text-2xl font-bold mb-4">Google Gemini Summary:</h2>
            <ul className="list-disc pl-6">
                <li>Profile Data Visualization: Users can view their budgeting data and associated tables on /profile/id/yourdata.</li>
                <li>Generate Summary: The "Generate Summary" feature evaluates the disposable income and provides a summary of recommended actions based on the result obtained from the Google Gemini LLM.</li>
            </ul>
        </section>
    </div>
</div>
    )
}

export default About