# Biashara Records: the app

A very simple business record app for Kenyan small businesses. It uses big buttons, pictures and **Kiswahili or English**.
It works **offline**, needs **no account and no server**, and keeps all data **on the user's own phone**.

## What it does

| Button | What happens |
|---|---|
| ➕ **Nimeuza / I sold** | Record a sale: type the amount, then tap 📱 M-Pesa, 💵 Cash or 📝 Credit. Afterwards, send a **receipt on WhatsApp** or print it. |
| ➖ **Nimetumia / I spent** | Record a business cost: pick a picture category, then answer "eTIMS invoice? ✅/❌". If ❌, the app warns the user and offers a ready **WhatsApp message asking the supplier for an eTIMS invoice**. |
| 📝 **Madeni / Debts** | Credit sales become debts automatically. Shows who owes what, marks **overdue** debts in red, records part-payments, and sends **WhatsApp/SMS reminders**. |
| 📩 **Bandika SMS ya M-Pesa / Paste M-Pesa SMS** | Paste an M-Pesa confirmation message. The app reads the amount, code, name and phone and fills the form, so there's no typing. |
| 📊 **Ripoti / Report** | Month by month: sales (M-Pesa, cash, credit), costs, **profit**, % of costs with eTIMS invoices, costs at risk, personal drawings and a tax estimate. Download as **CSV for Excel**. |
| ⚙️ **Mipangilio / Settings** | Business name, Till number, KRA PIN, tax type and rate, language, **backup and restore**, delete all. |

Designed for low literacy: every action is a large coloured button with an icon. Payment methods and categories are
picture buttons. Only the amount must be typed. All questions are short and the language can be switched at any time.

## Works on

- **Any smartphone browser:** Android (Chrome, Samsung Internet, Firefox, Opera) and iPhone (Safari).
  Opera Mini's data-saving "Extreme" mode doesn't run apps, so those users should use Chrome.
  Tested from very small screens (320 px wide) upward.
- **Computers:** Windows, Mac, Linux, Chromebook, in any modern browser.
- **Install like an app:** on Android tap "📲 Weka app kwenye simu" (or browser menu → *Install app / Add to Home screen*).
  On iPhone tap Share ⬆️ → *Add to Home Screen*. After the first visit it **opens without internet**.
- **Not supported:** basic "kabambe" feature phones can't run apps. Those users can use KRA's `*222#` for eTIMS and the
  printed tracker from the starter kit.

## Privacy & data safety

- No login and no internet needed after the first load. Records are stored only in the browser on that device (`localStorage`).
- **Backup:** Settings → *Pakua nakala* downloads a `.json` file. Save it to Google Drive or send it to yourself on WhatsApp.
  The home screen reminds the user if they haven't backed up for 7 days.
- **Restore** the file on a new phone with Settings → *Rudisha nakala*.
- Clearing browser data or uninstalling the browser deletes the records, which is why backups matter.

## Live link

**https://mwita-code.github.io/Mwita-code/** (free hosting on GitHub Pages)

The site is served from the `gh-pages` branch, which holds only the published app files.
**To publish an update:** bump the version numbers (see below), then copy `index.html`, `app.js`, `styles.css`, `sw.js`,
`manifest.json` and `icons/` from this folder to the `gh-pages` branch and push. The site updates within about a minute.

Other free options: Netlify Drop (app.netlify.com/drop, drag the `app` folder). Later you can buy a domain
(e.g. `biashararecords.co.ke`) and point it at GitHub Pages in repo **Settings → Pages → Custom domain**.

## For developers

```bash
cd app
python3 -m http.server 8765        # then open http://localhost:8765
node tests/e2e.js [screenshot-dir] # full user journey on a phone screen (needs playwright)
node tests/offline.js              # checks the app opens with no internet
```

- No build step and no dependencies. ES5-style JavaScript for old Android browsers.
- **Every release:** bump `VERSION` in `sw.js` and `APP_VERSION` in `app.js` so phones pick up the update.
- All user text is HTML-escaped before display. CSV export guards against spreadsheet formula injection.

*Record-keeping tool only, not tax advice. Not affiliated with KRA or Safaricom. M-Pesa is a trademark of Safaricom PLC.*
