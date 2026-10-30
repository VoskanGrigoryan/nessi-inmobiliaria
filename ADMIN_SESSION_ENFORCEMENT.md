# One active admin session per account

**Status:** Deferred until a separate developer account is available.

## Goal

Prevent a second person from using an admin account while its first session is active. Recommended behavior: keep the first session and reject the new login. An explicit takeover option can be considered later if needed.

This is different from Supabase's built-in **Single session per user** setting: that setting keeps the most recently active session, is available on Pro and higher plans, and enforces the change when sessions refresh. It is not a strict "reject the second login" lock. See [Supabase session management](https://supabase.com/docs/guides/auth/sessions).

## Current behavior

- `src/app/admin/actions.ts` signs in with `signInWithPassword` and does not check whether the account already has an active app session.
- Supabase allows multiple sessions by default. If local development uses the production Supabase URL and key, its login shares the same Supabase Auth project as the live site.
- The current `logout()` calls `signOut()` without a scope. Supabase JS defaults this to global sign-out, which revokes refresh tokens for all sessions. Review this when implementing a first-session-wins policy; a rejected login must not sign out the existing session. See [Supabase sign-out scopes](https://supabase.com/docs/guides/auth/signout).

## Expected performance and cost

The lock can use the existing Supabase database; it does not require a paid plan or another service. It adds a small indexed session check to protected admin activity. Put the check inside the existing admin access check or database RLS policies where possible, to avoid an extra network request per operation. Public browsing does not need this check. At the current scale of a few administrators, the expected database work is modest, though it still counts toward the project's database usage.

The main work is correctness and stale-session recovery, rather than performance. A closed browser may not send a sign-out request. Also, a revoked Supabase access token can remain valid until it expires, so protected database access must check the current session rather than relying only on token revocation.

## Steps to implement later

1. **Separate development from production.** Create a developer admin account and point local development at a staging Supabase project. This prevents development sign-ins from interfering with the live account.
2. **Choose the lock policy.** Start with "first active session wins; reject later logins." Decide whether an authorized takeover is needed.
3. **Add a session-lock table and atomic database functions.** Store one active Supabase `session_id` per admin user, with a last-activity/expiry field. The claim function must be atomic so simultaneous login attempts cannot both win. Limit its use to the authenticated account and admins.
4. **Update the login action.** After password verification, claim the session. If the lock is already held, clear only the newly attempted local session and show an "account already in use" message. Do not let a rejected attempt revoke the active session.
5. **Enforce the lock server-side and in RLS.** Check the JWT `session_id` against the stored active session in `requireAdminContext()` and the admin RLS helper used for property, private-address, and storage access. Do not rely on hiding admin links in the browser.
6. **Handle release and recovery.** Release the lock on sign-out. Renew its expiry during protected activity and define how a new login can recover an abandoned/stale lock. Ensure a takeover, if enabled, immediately blocks the previous session's protected database operations.
7. **Update the login UI and documentation.** Explain that the account is already in use and provide the chosen recovery/takeover path.

Relevant code: `src/app/admin/actions.ts`, `src/lib/supabase/admin.ts`, and the RLS policies in `supabase/migrations/`.
