# What you need to do yourself

The security review fixed everything that lives in your site's own code. Four things
are left that I cannot complete from here, because they live in your Supabase account
settings or need a live backend connection. Please work through them in this order.

## 1. Turn off public sign-ups

Right now anyone on the internet can create an account on your backend. That matters
because several of the protections below trust "is this person signed in and marked as
the admin". Removing the ability for strangers to create accounts at all is the first
layer, and it is the single most valuable change on this page.

1. Open your Supabase project dashboard.
2. Go to **Authentication** -> **Sign In / Providers**.
3. Turn **off** "Allow new users to sign up".

## 2. Mark your own account as the admin

The enquiry list, the alert list and the video manager are now restricted to one
account: the one carrying an admin marker that only the server can set. Until you set
that marker, those screens will load but show nothing.

Open `SECURITY-FIXES.sql` at the root of this project and replace the placeholder email
in the very first block with the email address you sign in to the admin screen with.

## 3. Run the database repairs

`SECURITY-FIXES.sql` contains every database-side repair from the review, with a comment
above each one explaining what it closes: the enquiry list and the alert list are no
longer readable by strangers or by any random signed-in account, the video manager can
only be changed by you, uploads are limited to video files under 500 MB, and the
advertising log is private.

1. Open **SQL Editor** in the same dashboard.
2. Paste the whole of `SECURITY-FIXES.sql` in and press **Run**.
3. It is safe to run more than once.

Afterwards, sign in to the admin screen and confirm the enquiry list, the alert list and
the video manager still load. If they are empty, the email in the first block did not
match your admin account.

## 4. Make the spam check on the alert form real

The property alert form already shows a "prove you are human" widget, but nothing on the
server side ever checks its answer, so a script can submit the form straight past it and
flood your alert list and your inbox. Making it real needs one small server-side change
plus a secret key, which I could not put in place without a live connection to your
backend.

When you are ready, ask me to "verify the human check on the alert form on the server".
I will need the **secret key** for that widget from your Cloudflare Turnstile dashboard
(the site key is already in the page; the secret key is the matching private half).

Until that is done, the widget is decoration: keep an eye on the alert list for obvious
junk entries.
