# What you need to do yourself

Two things protect your site that I cannot switch on from here, because they live in
your Supabase account settings rather than in the site's code. Please do both.

## 1. Turn off public sign-ups

Right now anyone on the internet can create an account on your backend. That matters
because several of the protections below trust "is this person signed in and marked as
the admin". Removing the ability for strangers to create accounts at all is the first
layer.

1. Open your Supabase project dashboard.
2. Go to **Authentication** -> **Sign In / Providers**.
3. Turn **off** "Allow new users to sign up".

## 2. Mark your own account as the admin

The enquiry list, the alert list and the video manager are now restricted to one
account: the one carrying an admin marker that only the server can set. Until you set
that marker, those screens will load but show nothing.

Open **SQL Editor** in the same dashboard, put your own admin email into the first
block of `SECURITY-FIXES.sql`, and run that whole file. The first block sets the marker;
the rest closes the access holes.

## 3. Run the rest of the fixes

`SECURITY-FIXES.sql` at the root of this project contains every database-side repair
from the audit, with a comment above each one explaining what it closes. Paste it into
the SQL Editor and press Run. It is safe to run more than once.

Afterwards, sign in to the admin screen and confirm the enquiry and alert lists still
load. If they are empty, the email in the first block did not match your admin account.
