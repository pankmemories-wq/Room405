/**
 * Room 405 — Daily WhatsApp Duty Reminder
 * ------------------------------------------------
 * This script runs once a day (triggered by GitHub Actions).
 * It checks today's day of the week, looks up who is doing what,
 * and sends each person a WhatsApp message via the CallMeBot API.
 *
 * You do NOT need to run this yourself — GitHub Actions runs it for you.
 * This file is here so you can see exactly what it does, and edit names/
 * phone numbers/schedule if anything changes.
 */

// ---- 1. THE SCHEDULE (must match the website's schedule) ----
const SCHEDULE = {
  Monday:    { cutting: "Adinath", cooking: "Pankaj",  washing: "Manoj",   rest: "Pranav"  },
  Tuesday:   { cutting: "Pranav",  cooking: "Adinath", washing: "Pankaj",  rest: "Manoj"   },
  Wednesday: { cutting: "Manoj",   cooking: "Pranav",  washing: "Adinath", rest: "Pankaj"  },
  Thursday:  { cutting: "Pankaj",  cooking: "Manoj",   washing: "Pranav",  rest: "Adinath" },
  Friday:    { cutting: "Adinath", cooking: "Manoj",   washing: "Pranav",  rest: "Pankaj"  },
  Saturday:  { cutting: "Pankaj",  cooking: "Pranav",  washing: "Adinath", rest: "Manoj"   },
  Sunday:    { cutting: "Manoj",   cooking: "Adinath", washing: "Pankaj",  rest: "Pranav"  },
};

// ---- 2. PHONE NUMBERS + CALLMEBOT API KEYS ----
// Fill these in after each person registers with CallMeBot (steps given separately).
// Phone numbers must be in international format WITHOUT a "+" or leading zeros,
// e.g. India number 98765 43210 becomes "919876543210".
const MEMBERS = {
  Adinath: { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
  Pankaj:  { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
  Manoj:   { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
  Pranav:  { phone: "PHONE_NUMBER_HERE", apikey: "APIKEY_HERE" },
};

// ---- 3. FIGURE OUT TODAY ----
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function getTodayIST() {
  // Force the calculation into India time, so the message always matches
  // the correct day even though GitHub's servers run on UTC time.
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istString);
  return DAYS[istDate.getDay()];
}

// ---- 4. BUILD TODAY'S TASK MAP (person -> task) ----
function getTodaysTasks(today) {
  const s = SCHEDULE[today];
  if (!s) {
    console.error("No schedule found for:", today);
    process.exit(1);
  }
  return {
    [s.cutting]: "Vegetable Cutting 🔪",
    [s.cooking]: "Cooking 🍳",
    [s.washing]: "Washing dishes 🧽",
    [s.rest]:    "Rest day 😌 (no duty today)",
  };
}

// ---- 5. SEND ONE WHATSAPP MESSAGE VIA CALLMEBOT ----
async function sendWhatsApp(name, phone, apikey, message) {
  if (!phone || phone.includes("PHONE_NUMBER_HERE") || !apikey || apikey.includes("APIKEY_HERE")) {
    console.warn(`Skipping ${name} — phone/apikey not set yet.`);
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apikey}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log(`Sent to ${name}: ${text}`);
  } catch (err) {
    console.error(`Failed to send to ${name}:`, err.message);
  }
}

// ---- 6. MAIN ----
async function main() {
  const today = getTodayIST();
  console.log("Today is:", today);

  const tasks = getTodaysTasks(today);

  for (const [name, member] of Object.entries(MEMBERS)) {
    const task = tasks[name] || "No task assigned — please check the schedule.";
    const message =
      `🏠 Room 405 Duty Reminder\n` +
      `📅 ${today}\n` +
      `👤 ${name}\n` +
      `✅ Your task today: ${task}\n\n` +
      `Full schedule: ${process.env.SITE_URL || "(set your website link in the workflow file)"}`;

    await sendWhatsApp(name, member.phone, member.apikey, message);

    // Small delay between messages so we don't hit CallMeBot too fast
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("All messages processed.");
}

main();
