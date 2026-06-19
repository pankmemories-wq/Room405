# Room 405 — Duty Board + Daily WhatsApp Reminders

This project has two parts:
1. **A website** (`docs/index.html`) showing the weekly duty schedule and house rules.
2. **An automation** (`send-whatsapp.js` + GitHub Actions) that sends each roommate
   a WhatsApp message every day telling them their task.

Everything below is free. No coding experience needed — just follow the steps in order.

---

## PART A — Put the code on GitHub

1. Go to https://github.com and create a free account (skip if you have one).
2. Click the **+** icon (top right) → **New repository**.
3. Name it `room405` → keep it **Public** → click **Create repository**.
4. On the new repo page, click **uploading an existing file**.
5. Upload ALL the files/folders from this project, keeping the same folder structure:
   - `docs/index.html`
   - `send-whatsapp.js`
   - `.github/workflows/daily-reminder.yml`
6. Scroll down, click **Commit changes**.

> Tip: if drag-and-drop on GitHub's website doesn't preserve folders properly,
> you can also install GitHub Desktop (free, no command line) and push the folder from there.

---

## PART B — Put the website online (Netlify)

1. Go to https://netlify.com → sign up free (you can sign up with your GitHub account directly — easiest option).
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** → select your `room405` repository.
4. When asked for the **publish directory**, type: `docs`
5. Click **Deploy site**.
6. Netlify gives you a free link like `https://room405-xyz123.netlify.app`. That's your live website!
7. Optional: in Netlify, go to **Site settings → Change site name** to make the link nicer,
   e.g. `room405.netlify.app`.

✅ Your website is now live. Anyone with the link can check today's duty.

---

## PART C — Register each person on CallMeBot (for WhatsApp messages)

Each of the 4 of you needs to do this **once**, on your own phone:

1. Save this number in your phone contacts: **+34 644 51 06 35**
2. Send this exact message to that number on WhatsApp:
   ```
   I allow callmebot to send me messages
   ```
3. Wait for a reply. It will contain your **personal API key** (a number), like:
   `API Activated for your phone number. Your APIKEY is 123456`
4. Note down:
   - Your **phone number** in international format, no `+` and no leading 0.
     Example: an Indian number `98765 43210` becomes `919876543210`.
   - Your **API key** from the reply message.

Repeat this for Adinath, Pankaj, Manoj, and Pranav — each person uses their own
WhatsApp number and gets their own unique API key.

---

## PART D — Fill in everyone's details in the code

1. On GitHub, open `send-whatsapp.js` in your repo.
2. Click the **pencil (edit) icon**.
3. Find this section near the top:
   ```js
   const MEMBERS = {
     Adinath: { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
     Pankaj:  { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
     Manoj:   { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
     Pranav:  { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
   };
   ```
4. Replace `PHONE_NUMBER_HERE` and `APIKEY_HERE` for each person with their real
   number and API key from Part C. Example:
   ```js
   const MEMBERS = {
     Adinath: { phone: "919876543210", apikey: "123456" },
     Pankaj:  { phone: "919812345678", apikey: "654321" },
     Manoj:   { phone: "919800011122", apikey: "111222" },
     Pranav:  { phone: "919811122233", apikey: "333444" },
   };
   ```
5. Scroll down, click **Commit changes**.

---

## PART E — Point it at your website link

1. Still on GitHub, open `.github/workflows/daily-reminder.yml` → click edit (pencil).
2. Find this line:
   ```yaml
   SITE_URL: "https://YOUR-SITE-NAME.netlify.app"
   ```
3. Replace it with your actual Netlify link from Part B.
4. Commit changes.

---

## PART F — Set the daily time (optional)

By default, messages send at **6:00 PM IST** every day. To change the time:

1. Open `.github/workflows/daily-reminder.yml`.
2. Find this line:
   ```yaml
   - cron: "30 12 * * *"
   ```
3. This means "12:30 UTC" = "18:00 IST". To pick a different IST time, subtract
   5 hours 30 minutes to get the UTC time to put here. A few examples:
   - 7:00 AM IST → `30 1 * * *`
   - 9:00 PM IST → `30 15 * * *`
   - 11:00 PM IST → `30 17 * * *`
4. Commit changes.

---

## PART G — Test it immediately (don't wait a full day)

1. On GitHub, go to the **Actions** tab of your repo.
2. Click **Send Daily Room 405 WhatsApp Reminders** in the left sidebar.
3. Click **Run workflow** (button on the right) → **Run workflow** again to confirm.
4. Wait ~30 seconds, refresh — you'll see it running, then a green checkmark when done.
5. Check WhatsApp on all 4 phones — each person should get a message.

If someone didn't get a message:
- Click into the workflow run → click the job → read the log. It will say
  exactly which person failed and why (usually a wrong number or API key).
- Fix the value in `send-whatsapp.js`, commit again, and re-run.

---

## That's it — fully automatic from here

Once Parts A–F are done, you never have to do anything again. Every day at your
chosen time, GitHub Actions will automatically:
1. Check what day it is (in IST)
2. Look up each person's task
3. Send all 4 of you a WhatsApp message with your task

If the duty schedule ever changes, just edit the `SCHEDULE` object in BOTH
`docs/index.html` and `send-whatsapp.js` (keep them identical) and commit.

---

## Files in this project

| File | Purpose |
|---|---|
| `docs/index.html` | The website — schedule, rules, today's duty |
| `send-whatsapp.js` | Sends the daily WhatsApp messages |
| `.github/workflows/daily-reminder.yml` | Tells GitHub when to run the script automatically |
