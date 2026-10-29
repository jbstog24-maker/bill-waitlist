# Bill Waitlist - landing page

Public waitlist page for the bill-paying app concept: everyday people upload a verified bill, generous donors pay it directly to the biller and get public credit.

Status: concept test only. No final brand name. The page runs under a descriptive working label while the name is pending trademark review. Do not add a name, logo, or domain as final branding.

How it works:
- index.html is a static landing page with a two-lane waitlist form (help with a bill, pay bills, business or creator partner, curious)
- api/join.js is a Vercel serverless function that validates each signup and saves it as one private JSON file per signup in Vercel Blob under signups/
- Signups are read in the Vercel dashboard: Project, Storage, the Blob store, signups folder. Each file holds one signup with its timestamp and lane
- No money moves through this site. No bill uploads are collected at this stage

Deploy notes:
- Vercel project must have a Blob store connected (private access) so BLOB_READ_WRITE_TOKEN is set, then a fresh production deployment so the function picks the token up
