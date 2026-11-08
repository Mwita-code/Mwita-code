/* Biashara Records — simple offline business records (sales, expenses, debts, eTIMS).
 * Plain JavaScript, no build step, no server. All data stays on the user's device (localStorage).
 * Designed for low-end phones: big buttons, icons, Kiswahili/English.
 */
(function () {
  'use strict';

  var KEY = 'biashara_records_v1';
  var APP_VERSION = '1.1.0';

  // ------------------------------------------------------------------ text
  var T = {
    sw: {
      chooseLang: 'Chagua lugha', home: 'Nyumbani', today: 'Leo', sales: 'Mauzo', spent: 'Matumizi', profit: 'Faida',
      addSale: 'Nimeuza', addExpense: 'Nimetumia', debts: 'Madeni', report: 'Ripoti', smsBtn: 'Bandika SMS ya M-Pesa',
      settings: 'Mipangilio', help: 'Msaada', amount: 'Kiasi (KSh)', whatSold: 'Umeuza nini?', optional: '(si lazima)',
      paidHow: 'Amelipa vipi?', mpesa: 'M-Pesa', cash: 'Pesa taslimu', credit: 'Deni', bank: 'Benki',
      customer: 'Jina la mteja', phone: 'Namba ya simu', dueDate: 'Atalipa lini?', mpesaCode: 'Namba ya M-Pesa (k.m. SKL4ABC123)',
      save: 'HIFADHI', cancel: 'Ghairi', saved: 'Imehifadhiwa ✔', enterAmount: 'Andika kiasi kwanza',
      enterName: 'Andika jina la mteja', whatFor: 'Umetumia kwa nini?', supplier: 'Umemlipa nani?',
      etimsQ: 'Umepata invoice ya eTIMS?', yes: 'Ndiyo', no: 'Hapana', notNeeded: 'Haihitajiki',
      etimsWarn: 'Omba invoice ya eTIMS. Bila hiyo, KRA huenda isikubali gharama hii.',
      askEtimsWa: 'Mwombe invoice kwa WhatsApp', saleSaved: 'Mauzo yamehifadhiwa!', expSaved: 'Matumizi yamehifadhiwa!',
      shareReceipt: 'Tuma risiti kwa WhatsApp', printReceipt: 'Chapisha risiti', done: 'Sawa, nimemaliza', addAnother: 'Ongeza nyingine',
      receipt: 'Risiti', date: 'Tarehe', paidBy: 'Malipo', thanks: 'Asante kwa biashara yako!',
      owes: 'anadaiwa', balance: 'Salio', paid: 'Amelipa', overdue: 'Muda umepita', notDue: 'Bado', fullyPaid: 'Amemaliza',
      recordPay: 'Rekodi malipo', payAmount: 'Amelipa kiasi gani?', remind: 'Mkumbushe kwa WhatsApp', remindSms: 'Mkumbushe kwa SMS',
      noDebts: 'Hakuna anayekudai. Vizuri!', addOldDebt: 'Ongeza deni la zamani', totalOwed: 'Jumla unayodai',
      whatTook: 'Alichukua nini?', debtSaved: 'Deni limehifadhiwa', payTooBig: 'Kiasi ni zaidi ya salio',
      month: 'Mwezi', expenses: 'Matumizi', creditUnpaid: 'Mauzo ya deni', etimsCover: 'Matumizi yenye eTIMS',
      atRisk: 'Matumizi bila eTIMS (hatari)', drawings: 'Pesa zako binafsi (si gharama)', taxEst: 'Makadirio ya kodi (weka akiba)',
      taxNote: 'Ni makadirio tu. Thibitisha kiwango na KRA (kra.go.ke).', entries: 'Rekodi za mwezi huu', noEntries: 'Hakuna rekodi mwezi huu.',
      del: 'Futa', confirmDel: 'Futa rekodi hii?', deleted: 'Imefutwa', exportCsv: 'Pakua kwa Excel (CSV)',
      bizName: 'Jina la biashara', yourPhone: 'Namba yako ya simu', till: 'Namba ya Till / Paybill / Pochi', kraPin: 'KRA PIN',
      taxRegime: 'Aina ya kodi', taxRate: 'Kiwango cha kodi kwa mauzo (%)', tot: 'Turnover Tax (TOT)', incomeTax: 'Kodi ya mapato',
      vat: 'VAT', notSure: 'Sijui bado', language: 'Lugha', backup: 'Hifadhi nakala (Backup)', backupNow: 'Pakua nakala sasa',
      restore: 'Rudisha nakala (Restore)', restoreConfirm: 'Hii itafuta rekodi zilizopo na kuweka za nakala. Endelea?',
      restored: 'Nakala imerudishwa ✔', badFile: 'Faili hili si nakala sahihi', wipe: 'Futa rekodi zote',
      wipeConfirm: 'Una uhakika? Rekodi zote zitafutwa kabisa.', wipeConfirm2: 'Andika FUTA kuthibitisha',
      backupNag: 'Hujahifadhi nakala kwa siku 7. Simu ikipotea, rekodi zinapotea.', backupDone: 'Nakala imepakuliwa ✔',
      smsTitle: 'Bandika SMS ya M-Pesa', smsHelp: 'Nakili ujumbe wa M-Pesa, kisha bandika hapa. Tutajaza kiasi na namba kwa ajili yako.',
      readSms: 'SOMA SMS', smsIn: 'Pesa imeingia: hii ni mauzo?', smsOut: 'Pesa imetoka: haya ni matumizi?',
      smsFail: 'Hatukuweza kusoma SMS hii. Jaza mwenyewe.', asSale: 'Ni mauzo', asExpense: 'Ni matumizi', pasteFromPhone: 'Bandika',
      install: 'Weka app kwenye simu', iosInstall: 'iPhone: bonyeza Share ⬆️ kisha "Add to Home Screen".',
      helpTitle: 'Jinsi ya kutumia', disclaimer: 'Programu hii ni ya kuweka rekodi tu. Si ushauri wa kodi. Haihusiani na KRA wala Safaricom.',
      saveFailed: 'Imeshindwa kuhifadhi. Nafasi ya simu imejaa?', back: 'Rudi', other: 'Mengineyo', print: 'Chapisha',
      quickPick: 'Chagua haraka:', pin: 'Namba ya KRA PIN ya msambazaji', from: 'Kutoka', to: 'Kwa', records: 'rekodi',
      morning: 'Habari za asubuhi', afternoon: 'Habari za mchana', evening: 'Habari za jioni', todayProfit: 'Faida ya leo',
      saleSub: 'Rekodi mauzo', expSub: 'Rekodi gharama', debtSub: 'Wanaokudai', repSub: 'Faida ya mwezi',
      smsShort: 'SMS ya M-Pesa', smsSub: 'Jaza kwa haraka', setSub: 'Biashara yako', danger: 'Hatari',
      weekTip: 'Kidokezo: rekodi kila mauzo leo, si kesho.', allTime: 'Wanaodaiwa'
    },
    en: {
      chooseLang: 'Choose language', home: 'Home', today: 'Today', sales: 'Sales', spent: 'Spent', profit: 'Profit',
      addSale: 'I sold', addExpense: 'I spent', debts: 'Debts', report: 'Report', smsBtn: 'Paste M-Pesa SMS',
      settings: 'Settings', help: 'Help', amount: 'Amount (KSh)', whatSold: 'What did you sell?', optional: '(optional)',
      paidHow: 'How did they pay?', mpesa: 'M-Pesa', cash: 'Cash', credit: 'Credit', bank: 'Bank',
      customer: 'Customer name', phone: 'Phone number', dueDate: 'When will they pay?', mpesaCode: 'M-Pesa code (e.g. SKL4ABC123)',
      save: 'SAVE', cancel: 'Cancel', saved: 'Saved ✔', enterAmount: 'Type the amount first',
      enterName: 'Type the customer name', whatFor: 'What was it for?', supplier: 'Who did you pay?',
      etimsQ: 'Did you get an eTIMS invoice?', yes: 'Yes', no: 'No', notNeeded: 'Not needed',
      etimsWarn: 'Ask for an eTIMS invoice. Without it, KRA may not accept this cost.',
      askEtimsWa: 'Ask for invoice on WhatsApp', saleSaved: 'Sale saved!', expSaved: 'Expense saved!',
      shareReceipt: 'Send receipt on WhatsApp', printReceipt: 'Print receipt', done: 'OK, done', addAnother: 'Add another',
      receipt: 'Receipt', date: 'Date', paidBy: 'Payment', thanks: 'Thank you for your business!',
      owes: 'owes', balance: 'Balance', paid: 'Paid', overdue: 'Overdue', notDue: 'Not due', fullyPaid: 'Paid up',
      recordPay: 'Record payment', payAmount: 'How much did they pay?', remind: 'Remind on WhatsApp', remindSms: 'Remind by SMS',
      noDebts: 'Nobody owes you. Great!', addOldDebt: 'Add an old debt', totalOwed: 'Total owed to you',
      whatTook: 'What did they take?', debtSaved: 'Debt saved', payTooBig: 'Amount is more than the balance',
      month: 'Month', expenses: 'Expenses', creditUnpaid: 'Credit sales', etimsCover: 'Expenses with eTIMS',
      atRisk: 'Expenses without eTIMS (risk)', drawings: 'Your personal money (not a cost)', taxEst: 'Tax estimate (save this)',
      taxNote: 'Estimate only. Confirm the rate with KRA (kra.go.ke).', entries: 'This month\'s records', noEntries: 'No records this month.',
      del: 'Delete', confirmDel: 'Delete this record?', deleted: 'Deleted', exportCsv: 'Download for Excel (CSV)',
      bizName: 'Business name', yourPhone: 'Your phone number', till: 'Till / Paybill / Pochi number', kraPin: 'KRA PIN',
      taxRegime: 'Tax type', taxRate: 'Tax rate on sales (%)', tot: 'Turnover Tax (TOT)', incomeTax: 'Income tax',
      vat: 'VAT', notSure: 'Not sure yet', language: 'Language', backup: 'Backup', backupNow: 'Download backup now',
      restore: 'Restore backup', restoreConfirm: 'This replaces your current records with the backup. Continue?',
      restored: 'Backup restored ✔', badFile: 'This file is not a valid backup', wipe: 'Delete all records',
      wipeConfirm: 'Are you sure? All records will be deleted forever.', wipeConfirm2: 'Type DELETE to confirm',
      backupNag: 'No backup for 7 days. If you lose your phone, you lose your records.', backupDone: 'Backup downloaded ✔',
      smsTitle: 'Paste M-Pesa SMS', smsHelp: 'Copy the M-Pesa message and paste it here. We fill in the amount and code for you.',
      readSms: 'READ SMS', smsIn: 'Money came in: is this a sale?', smsOut: 'Money went out: is this an expense?',
      smsFail: 'Could not read this SMS. Please fill in by hand.', asSale: 'It\'s a sale', asExpense: 'It\'s an expense', pasteFromPhone: 'Paste',
      install: 'Install app on this phone', iosInstall: 'iPhone: tap Share ⬆️ then "Add to Home Screen".',
      helpTitle: 'How to use', disclaimer: 'This app is for record keeping only. It is not tax advice. Not affiliated with KRA or Safaricom.',
      saveFailed: 'Could not save. Is the phone storage full?', back: 'Back', other: 'Other', print: 'Print',
      quickPick: 'Quick pick:', pin: 'Supplier KRA PIN', from: 'From', to: 'To', records: 'records',
      morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', todayProfit: 'Today\'s profit',
      saleSub: 'Record a sale', expSub: 'Record a cost', debtSub: 'Who owes you', repSub: 'Monthly profit',
      smsShort: 'M-Pesa SMS', smsSub: 'Fill in fast', setSub: 'Your business', danger: 'Danger zone',
      weekTip: 'Tip: record every sale today, not tomorrow.', allTime: 'People who owe you'
    }
  };

  var CATS = [
    ['stock', '📦', 'Mzigo / Bidhaa', 'Stock'], ['rent', '🏠', 'Kodi ya nyumba', 'Rent'],
    ['power', '💡', 'Stima na maji', 'Power & water'], ['transport', '🚚', 'Usafiri', 'Transport'],
    ['airtime', '📱', 'Vocha na intaneti', 'Airtime & data'], ['wages', '👷', 'Mishahara', 'Wages'],
    ['packaging', '🛍️', 'Vifungashio', 'Packaging'], ['repairs', '🔧', 'Matengenezo', 'Repairs'],
    ['licence', '📄', 'Leseni', 'Licences'], ['charges', '🏦', 'Ada za benki/M-Pesa', 'Bank/M-Pesa fees'],
    ['marketing', '📣', 'Matangazo', 'Marketing'], ['drawings', '👛', 'Pesa yangu binafsi', 'Personal use'],
    ['other', '➕', 'Mengineyo', 'Other']
  ];
  var METHODS = { mpesa: '📱', cash: '💵', credit: '📝', bank: '🏦' };

  // ------------------------------------------------------------------ state
  function blank() {
    return {
      v: 1, settings: { lang: '', bizName: '', phone: '', till: '', kraPin: '', regime: 'tot', taxRate: 1.5 },
      sales: [], expenses: [], debts: [], counter: 0, lastBackup: 0
    };
  }
  function valid(d) {
    return d && typeof d === 'object' && d.settings && Array.isArray(d.sales) && Array.isArray(d.expenses) && Array.isArray(d.debts);
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (valid(d)) { var b = blank(); for (var k in b.settings) if (!(k in d.settings)) d.settings[k] = b.settings[k]; return d; }
      }
    } catch (e) { /* storage blocked or corrupt: start fresh */ }
    return blank();
  }
  var S = load();
  var ui = { month: monthOf(today()), draft: null, last: null, installEvt: null };

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); return true; }
    catch (e) { toast(t('saveFailed')); return false; }
  }

  // ------------------------------------------------------------------ helpers
  function t(k) { var L = T[S.settings.lang] || T.sw; return L[k] != null ? L[k] : (T.en[k] || k); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function monthOf(iso) { return String(iso).slice(0, 7); }
  // Output is always HTML-safe (dates can come from a restored backup file).
  function fmtDate(iso) { var p = String(iso == null ? '' : iso).split('-'); return esc(p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso); }
  function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? Math.round(n * 100) / 100 : 0; }
  function money(n) {
    n = Math.round((Number(n) || 0) * 100) / 100;
    var neg = n < 0, s = Math.abs(n).toFixed(2).replace(/\.00$/, ''), parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + 'KSh ' + parts.join('.');
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function sum(arr, f) { var s = 0; for (var i = 0; i < arr.length; i++) s += f(arr[i]); return Math.round(s * 100) / 100; }
  function catLabel(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === id) return CATS[i][1] + ' ' + (S.settings.lang === 'en' ? CATS[i][3] : CATS[i][2]); return id; }
  function methodLabel(m) { return (METHODS[m] || '') + ' ' + t(m); }
  function monthName(ym) {
    var p = ym.split('-'), m = parseInt(p[1], 10) - 1;
    var sw = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'];
    var en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return (S.settings.lang === 'en' ? en : sw)[m] + ' ' + p[0];
  }
  function shiftMonth(ym, d) {
    var p = ym.split('-'), y = parseInt(p[0], 10), m = parseInt(p[1], 10) - 1 + d;
    y += Math.floor(m / 12); m = ((m % 12) + 12) % 12;
    return y + '-' + pad(m + 1);
  }
  // Kenyan phone -> 2547XXXXXXXX for wa.me links; returns '' if not recognisable.
  function intlPhone(p) {
    var d = String(p || '').replace(/\D/g, '');
    if (/^0[17]\d{8}$/.test(d)) return '254' + d.slice(1);
    if (/^254[17]\d{8}$/.test(d)) return d;
    if (/^[17]\d{8}$/.test(d)) return '254' + d;
    return '';
  }
  function waLink(phone, text) { var p = intlPhone(phone); return 'https://wa.me/' + p + '?text=' + encodeURIComponent(text); }
  function smsLink(phone, text) { return 'sms:' + String(phone || '').replace(/[^\d+]/g, '') + '?body=' + encodeURIComponent(text); }
  function debtBalance(d) { return Math.round((d.amount - sum(d.payments || [], function (p) { return p.amount; })) * 100) / 100; }
  function debtStatus(d) { var b = debtBalance(d); if (b <= 0) return 'paid'; if (d.due && d.due < today()) return 'overdue'; return 'open'; }

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  // ------------------------------------------------------------------ M-Pesa SMS reader
  function parseMpesa(txt) {
    txt = String(txt || '').replace(/\s+/g, ' ').trim();
    if (!txt) return null;
    var r = { code: '', amount: 0, dir: '', name: '', phone: '' };
    var code = txt.match(/\b([A-Z][A-Z0-9]{9})\b/);
    if (code && /\d/.test(code[1])) r.code = code[1];
    var amt = txt.match(/Ksh\.?\s?([\d,]+(?:\.\d{1,2})?)/i);
    if (amt) r.amount = num(amt[1]);
    if (/(you have received|received from|umepokea|imepokelewa|has been received)/i.test(txt) || /\breceived\b.*\bfrom\b/i.test(txt)) r.dir = 'in';
    else if (/(sent to|paid to|withdraw|umetuma|umelipa|bought)/i.test(txt)) r.dir = 'out';
    var who = txt.match(/\bfrom ([A-Za-z][A-Za-z .'&-]{1,40}?)(?= ?(?:\+?254|0)\d{9}| on \d| -|\.|,|$)/i) ||
              txt.match(/\b(?:sent to|paid to) ([A-Za-z0-9][A-Za-z0-9 .'&-]{1,40}?)(?= ?(?:\+?254|0)\d{9}| for account| on \d|\.|,|$)/i);
    if (who) r.name = who[1].trim();
    var ph = txt.match(/(?:\+?254|0)([17]\d{8})\b/);
    if (ph) r.phone = '0' + ph[1];
    return (r.amount || r.code) ? r : null;
  }

  // ------------------------------------------------------------------ icons (inline SVG, work offline)
  var ICONS = {
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="16" y2="7"/><line x1="9" y1="11" x2="14" y2="11"/>',
    chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/>',
    gear: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    up: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    down: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    receipt: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    left: '<polyline points="15 18 9 12 15 6"/>', right: '<polyline points="9 18 15 12 9 6"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    clip: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
  };
  function ic(name) {
    return '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  function ptitle(icon, color, text) { return '<h1 class="ptitle"><span class="pi ' + color + '">' + ic(icon) + '</span>' + text + '</h1>'; }
  function alertBox(kind, icon, html) { return '<div class="alert ' + kind + '">' + ic(icon) + '<div class="alert-body">' + html + '</div></div>'; }
  function amountBox(val, ph) {
    return '<div class="amount-box"><span class="cur">KSh</span><input class="amount" id="amount" name="amount" type="text" inputmode="decimal" autocomplete="off" placeholder="' + esc(ph || '0') + '" value="' + esc(val || '') + '" aria-label="' + t('amount') + '"></div>';
  }
  function avatar(name) {
    var s = String(name || '?').replace(/[^A-Za-z0-9]/g, ''), c = (s.charAt(0) || '?').toUpperCase(), h = 0;
    for (var i = 0; i < s.length; i++) h = (h + s.charCodeAt(i)) % 6;
    return '<span class="avatar av' + h + '">' + esc(c) + '</span>';
  }

  // ------------------------------------------------------------------ views
  var V = {};

  V.lang = function () {
    return '<div class="welcome"><img src="icons/icon-192.png" alt=""><h1>Biashara Records</h1>' +
      '<p>Rekodi rahisi za biashara yako<br>Simple records for your business</p>' +
      '<p style="margin-bottom:12px;color:var(--ink)">🌍 Chagua lugha / Choose language</p>' +
      '<button class="btn primary" data-act="setLang" data-v="sw">🇰🇪 Kiswahili</button>' +
      '<button class="btn blue" data-act="setLang" data-v="en">🇬🇧 English</button></div>';
  };

  function greeting() { var h = new Date().getHours(); return h < 12 ? t('morning') : h < 17 ? t('afternoon') : t('evening'); }

  V.home = function () {
    var d = today();
    var ts = sum(S.sales.filter(function (s) { return s.date === d; }), function (s) { return s.amount; });
    var te = sum(S.expenses.filter(function (e) { return e.date === d && e.cat !== 'drawings'; }), function (e) { return e.amount; });
    var h = '<section class="hero"><div class="greet">' + greeting() + ' 👋</div>' +
      '<div class="biz">' + esc(S.settings.bizName || 'Biashara Records') + '</div><div class="date">' + t('today') + ' · ' + fmtDate(d) + '</div>' +
      '<div class="stats"><div class="stat net"><div class="lbl">' + t('todayProfit') + '</div><div class="val">' + money(ts - te) + '</div></div>' +
      '<div class="pills"><div class="pill stat in"><span class="dot">' + ic('up') + '</span><div><div class="lbl">' + t('sales') + '</div><div class="val">' + money(ts) + '</div></div></div>' +
      '<div class="pill stat out"><span class="dot">' + ic('down') + '</span><div><div class="lbl">' + t('spent') + '</div><div class="val">' + money(te) + '</div></div></div></div></div></section>';
    var hasData = S.sales.length + S.expenses.length + S.debts.length > 0;
    if (hasData && Date.now() - (S.lastBackup || 0) > 7 * 864e5) {
      h += '<div style="margin-top:16px">' + alertBox('orange', 'save', t('backupNag') + '<button class="btn light" data-act="backup">' + ic('download') + t('backupNow') + '</button>') + '</div>';
    }
    var overdue = S.debts.filter(function (x) { return debtStatus(x) === 'overdue'; }).length;
    function tile(cls, href, icon, title, sub, extra) {
      return '<a class="big ' + cls + '" href="' + href + '">' + (extra || '') + '<span class="ico">' + ic(icon) + '</span><span><span class="t">' + title + '</span><span class="s" style="display:block">' + sub + '</span></span></a>';
    }
    h += '<div class="big-grid">' +
      tile('sale', '#/sale', 'plus', t('addSale'), t('saleSub')) +
      tile('exp', '#/expense', 'minus', t('addExpense'), t('expSub')) +
      tile('debt', '#/debts', 'book', t('debts'), t('debtSub'), overdue ? '<span class="count">' + overdue + '</span>' : '') +
      tile('rep', '#/report', 'chart', t('report'), t('repSub')) +
      tile('sms', '#/sms', 'msg', t('smsShort'), t('smsSub')) +
      tile('set', '#/settings', 'gear', t('settings'), t('setSub')) + '</div>';
    if (ui.installEvt) h += '<button class="btn blue" data-act="install">' + ic('phone') + t('install') + '</button>';
    h += '<a class="btn light" href="#/help">' + ic('help') + t('help') + '</a>';
    return h;
  };

  function choice(name, val, ico, label, checked, cls) {
    return '<label class="choice' + (cls ? ' ' + cls : '') + '"><input type="radio" name="' + name + '" value="' + esc(val) + '"' +
      (checked ? ' checked' : '') + '><span><b>' + ico + '</b>' + esc(label) + '</span></label>';
  }
  function recentItems(list, field) {
    var seen = {}, out = [];
    for (var i = list.length - 1; i >= 0 && out.length < 6; i--) {
      var v = (list[i][field] || '').trim();
      if (v && !seen[v.toLowerCase()]) { seen[v.toLowerCase()] = 1; out.push(v); }
    }
    return out;
  }
  function chipRow(list, target) {
    if (!list.length) return '';
    var h = '<div class="chips">';
    list.forEach(function (c) { h += '<button type="button" class="chip" data-act="fill" data-target="' + target + '" data-v="' + esc(c) + '">' + esc(c) + '</button>'; });
    return h + '</div>';
  }

  V.sale = function () {
    var dr = ui.draft && ui.draft.kind === 'sale' ? ui.draft : {};
    var m = dr.method || 'mpesa';
    return ptitle('plus', 'c-green', t('addSale')) + '<form id="f" data-form="sale" novalidate>' +
      '<label class="f" for="amount">' + t('amount') + '</label>' + amountBox(dr.amount) +
      '<label class="f" for="item">' + t('whatSold') + ' <span class="mute">' + t('optional') + '</span></label>' +
      '<input id="item" name="item" type="text" maxlength="80" value="' + esc(dr.item || '') + '">' + chipRow(recentItems(S.sales, 'item'), 'item') +
      '<label class="f">' + t('paidHow') + '</label><div class="choices">' +
      choice('method', 'mpesa', '📱', t('mpesa'), m === 'mpesa') +
      choice('method', 'cash', '💵', t('cash'), m === 'cash') +
      choice('method', 'credit', '📝', t('credit'), m === 'credit') + '</div>' +
      '<div id="mpesaBox"' + (m === 'mpesa' ? '' : ' hidden') + '><label class="f" for="code">' + t('mpesaCode') + ' <span class="mute">' + t('optional') + '</span></label>' +
      '<input id="code" name="code" type="text" maxlength="12" autocapitalize="characters" value="' + esc(dr.code || '') + '"></div>' +
      '<div id="creditBox"' + (m === 'credit' ? '' : ' hidden') + '>' +
      '<label class="f" for="cust">' + t('customer') + '</label><input id="cust" name="cust" type="text" maxlength="60" value="' + esc(dr.name || '') + '">' +
      '<label class="f" for="due">' + t('dueDate') + ' <span class="mute">' + t('optional') + '</span></label><input id="due" name="due" type="date"></div>' +
      '<details' + (dr.phone || dr.name ? ' open' : '') + '><summary>👤 ' + t('customer') + ' / ' + t('phone') + ' ' + t('optional') + '</summary>' +
      '<label class="f" for="custAny">' + t('customer') + '</label><input id="custAny" name="custAny" type="text" maxlength="60" value="' + esc(dr.name || '') + '">' +
      '<label class="f" for="phone">' + t('phone') + '</label><input id="phone" name="phone" type="tel" maxlength="15" value="' + esc(dr.phone || '') + '">' +
      '<label class="f" for="date">' + t('date') + '</label><input id="date" name="date" type="date" value="' + today() + '"></details>' +
      '<button class="btn primary" type="submit">' + ic('check') + t('save') + '</button>' +
      '<a class="btn light" href="#/">' + t('cancel') + '</a></form>';
  };

  V.expense = function () {
    var dr = ui.draft && ui.draft.kind === 'expense' ? ui.draft : {};
    var h = ptitle('minus', 'c-red', t('addExpense')) + '<form id="f" data-form="expense" novalidate>' +
      '<label class="f" for="amount">' + t('amount') + '</label>' + amountBox(dr.amount) +
      '<label class="f">' + t('whatFor') + '</label><div class="choices">';
    CATS.forEach(function (c, i) { h += choice('cat', c[0], c[1], S.settings.lang === 'en' ? c[3] : c[2], i === 0); });
    h += '</div><label class="f" for="supplier">' + t('supplier') + ' <span class="mute">' + t('optional') + '</span></label>' +
      '<input id="supplier" name="supplier" type="text" maxlength="60" value="' + esc(dr.name || '') + '">' + chipRow(recentItems(S.expenses, 'supplier'), 'supplier') +
      '<div id="etimsBox"><label class="f">🧾 ' + t('etimsQ') + '</label><div class="choices">' +
      choice('etims', 'yes', '✅', t('yes'), false) + choice('etims', 'no', '❌', t('no'), false, 'no') +
      choice('etims', 'na', '➖', t('notNeeded'), false) + '</div>' +
      '<div id="etimsWarn" hidden>' + alertBox('red', 'alert', t('etimsWarn')) + '</div></div>' +
      '<label class="f">' + t('paidHow') + '</label><div class="choices">' +
      choice('method', 'mpesa', '📱', t('mpesa'), true) + choice('method', 'cash', '💵', t('cash'), false) +
      choice('method', 'bank', '🏦', t('bank'), false) + '</div>' +
      '<div id="mpesaBox"><label class="f" for="code">' + t('mpesaCode') + ' <span class="mute">' + t('optional') + '</span></label>' +
      '<input id="code" name="code" type="text" maxlength="12" autocapitalize="characters" value="' + esc(dr.code || '') + '"></div>' +
      '<details><summary>➕ ' + t('pin') + ' / ' + t('date') + '</summary>' +
      '<label class="f" for="pin">' + t('pin') + '</label><input id="pin" name="pin" type="text" maxlength="11" autocapitalize="characters">' +
      '<label class="f" for="date">' + t('date') + '</label><input id="date" name="date" type="date" value="' + today() + '"></details>' +
      '<button class="btn danger" type="submit">' + ic('check') + t('save') + '</button>' +
      '<a class="btn light" href="#/">' + t('cancel') + '</a></form>';
    return h;
  };

  function receiptText(s) {
    var L = [];
    L.push('*' + (S.settings.bizName || 'Biashara') + '*');
    if (S.settings.kraPin) L.push('KRA PIN: ' + S.settings.kraPin);
    L.push(t('receipt') + ' #' + s.no + '  |  ' + t('date') + ': ' + fmtDate(s.date));
    L.push('------------------------');
    L.push((s.item || t('sales')) + ': ' + money(s.amount));
    L.push(t('paidBy') + ': ' + t(s.method) + (s.code ? ' (' + s.code + ')' : ''));
    if (S.settings.till) L.push('M-Pesa: ' + S.settings.till);
    L.push('------------------------');
    L.push(t('thanks'));
    return L.join('\n');
  }

  V.saleDone = function () {
    var s = findById(S.sales, ui.last);
    if (!s) return V.home();
    var txt = receiptText(s);
    return '<div class="success"><div class="tick">' + ic('check') + '</div><h1>' + t('saleSaved') + '</h1><div class="amt pos">' + money(s.amount) + '</div><p class="mute">' + esc(methodLabel(s.method)) + '</p></div>' +
      '<div class="receipt-print" id="rcpt">' + esc(txt.replace(/\*/g, '')) + '</div>' +
      '<div class="no-print"><a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(s.phone, txt)) + '">' + ic('send') + t('shareReceipt') + '</a>' +
      '<button class="btn light" data-act="print">' + ic('printer') + t('printReceipt') + '</button>' +
      '<a class="btn primary" href="#/sale">' + ic('plus') + t('addAnother') + '</a>' +
      '<a class="btn light" href="#/">' + ic('home') + t('done') + '</a></div>';
  };

  V.expenseDone = function () {
    var e = findById(S.expenses, ui.last);
    if (!e) return V.home();
    var h = '<div class="success"><div class="tick red">' + ic('check') + '</div><h1>' + t('expSaved') + '</h1><div class="amt neg">' + money(e.amount) + '</div><p class="mute">' + esc(catLabel(e.cat)) + '</p></div>';
    if (e.etims === 'no' && e.cat !== 'drawings') {
      var msg = S.settings.lang === 'en'
        ? 'Hello, please send me an eTIMS invoice for my payment of ' + money(e.amount) + ' on ' + fmtDate(e.date) + '.' + (S.settings.kraPin ? ' My KRA PIN is ' + S.settings.kraPin + '.' : '') + ' Thank you.'
        : 'Habari, tafadhali nitumie invoice ya eTIMS ya malipo ya ' + money(e.amount) + ' ya tarehe ' + fmtDate(e.date) + '.' + (S.settings.kraPin ? ' KRA PIN yangu ni ' + S.settings.kraPin + '.' : '') + ' Asante.';
      h += alertBox('red', 'alert', t('etimsWarn')) +
        '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(e.phone, msg)) + '">' + ic('send') + t('askEtimsWa') + '</a>';
    }
    return h + '<a class="btn danger" href="#/expense">' + ic('minus') + t('addAnother') + '</a><a class="btn light" href="#/">' + ic('home') + t('done') + '</a>';
  };

  V.debts = function () {
    var list = S.debts.slice().sort(function (a, b) {
      var o = { overdue: 0, open: 1, paid: 2 }; var d = o[debtStatus(a)] - o[debtStatus(b)];
      return d || (a.due || '9').localeCompare(b.due || '9');
    });
    var open = list.filter(function (d) { return debtBalance(d) > 0; });
    var h = ptitle('book', 'c-orange', t('debts')) +
      '<div class="total-card"><div><div class="lbl">' + t('totalOwed') + '</div><div class="val">' + money(sum(open, debtBalance)) + '</div></div><span class="pi" style="background:rgba(255,255,255,.22)">' + ic('users') + '</span></div>';
    if (!list.length) h += '<p class="empty"><span class="big-e">🎉</span>' + t('noDebts') + '</p>';
    else {
      h += '<div class="card">';
      list.forEach(function (d) {
        var st = debtStatus(d), bal = debtBalance(d);
        var badge = st === 'overdue' ? '<span class="badge red">❗ ' + t('overdue') + '</span>' :
          st === 'paid' ? '<span class="badge green">✔ ' + t('fullyPaid') + '</span>' : '<span class="badge orange">⏳ ' + t('notDue') + '</span>';
        h += '<a class="row" href="#/debt/' + esc(d.id) + '">' + avatar(d.name) + '<div class="l"><div>' + esc(d.name) + '</div>' +
          '<div class="mute">' + fmtDate(d.date) + (d.item ? ' · ' + esc(d.item) : '') + (d.due ? ' · ⏰ ' + fmtDate(d.due) : '') + '</div>' + badge + '</div>' +
          '<div class="r ' + (bal > 0 ? 'neg' : 'pos') + '">' + money(bal) + '</div><span class="chev">' + ic('right') + '</span></a>';
      });
      h += '</div>';
    }
    return h + '<a class="btn light" href="#/newdebt">' + ic('plus') + t('addOldDebt') + '</a>';
  };

  V.newdebt = function () {
    return ptitle('book', 'c-orange', t('addOldDebt')) + '<form id="f" data-form="debt" novalidate>' +
      '<label class="f" for="cust">' + t('customer') + '</label><input id="cust" name="cust" type="text" maxlength="60">' +
      '<label class="f" for="amount">' + t('amount') + '</label>' + amountBox('') +
      '<label class="f" for="item">' + t('whatTook') + ' <span class="mute">' + t('optional') + '</span></label><input id="item" name="item" type="text" maxlength="80">' +
      '<label class="f" for="phone">' + t('phone') + ' <span class="mute">' + t('optional') + '</span></label><input id="phone" name="phone" type="tel" maxlength="15">' +
      '<label class="f" for="due">' + t('dueDate') + ' <span class="mute">' + t('optional') + '</span></label><input id="due" name="due" type="date">' +
      '<button class="btn primary" type="submit">' + ic('check') + t('save') + '</button><a class="btn light" href="#/debts">' + t('cancel') + '</a></form>';
  };

  V.debt = function (id) {
    var d = findById(S.debts, id);
    if (!d) return V.debts();
    var bal = debtBalance(d), st = debtStatus(d);
    var h = '<h1 class="ptitle">' + avatar(d.name) + '<span style="overflow-wrap:anywhere;min-width:0">' + esc(d.name) + '</span></h1>' +
      '<div class="card"><div class="row"><div class="l">📝 ' + t('credit') + (d.item ? ': ' + esc(d.item) : '') + '<div class="mute">' + fmtDate(d.date) + '</div></div><div class="r">' + money(d.amount) + '</div></div>';
    (d.payments || []).forEach(function (p) {
      h += '<div class="row"><div class="l">✅ ' + t('paid') + '<div class="mute">' + fmtDate(p.date) + ' · ' + esc(methodLabel(p.method)) + (p.code ? ' · ' + esc(p.code) : '') + '</div></div><div class="r pos">-' + money(p.amount) + '</div></div>';
    });
    h += '<div class="row"><div class="l" style="font-size:1.05rem">' + t('balance') + (d.due ? '<div class="mute">⏰ ' + fmtDate(d.due) + '</div>' : '') + '</div><div class="r ' + (bal > 0 ? 'neg' : 'pos') + '" style="font-size:1.25rem">' + money(bal) + '</div></div></div>';
    if (st === 'overdue') h += alertBox('red', 'bell', t('overdue'));
    if (bal > 0) {
      var msg = S.settings.lang === 'en'
        ? 'Hi ' + d.name + ', a friendly reminder about your balance of ' + money(bal) + ' from ' + fmtDate(d.date) + '.' + (S.settings.till ? ' You can pay via M-Pesa ' + S.settings.till + '.' : '') + ' Thank you! - ' + (S.settings.bizName || '')
        : 'Habari ' + d.name + ', natumai uko salama. Nakukumbusha kuhusu salio la ' + money(bal) + ' la tarehe ' + fmtDate(d.date) + '.' + (S.settings.till ? ' Unaweza kulipa kupitia M-Pesa ' + S.settings.till + '.' : '') + ' Asante sana! - ' + (S.settings.bizName || '');
      h += '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(d.phone, msg)) + '">' + ic('send') + t('remind') + '</a>';
      if (d.phone) h += '<a class="btn light" href="' + esc(smsLink(d.phone, msg)) + '">' + ic('msg') + t('remindSms') + '</a>';
      h += '<form id="f" data-form="pay" data-id="' + esc(d.id) + '" novalidate><h2>💵 ' + t('recordPay') + '</h2>' +
        '<label class="f" for="amount">' + t('payAmount') + '</label>' + amountBox('', String(bal)) +
        '<label class="f">' + t('paidHow') + '</label><div class="choices">' + choice('method', 'mpesa', '📱', t('mpesa'), true) + choice('method', 'cash', '💵', t('cash'), false) + choice('method', 'bank', '🏦', t('bank'), false) + '</div>' +
        '<label class="f" for="code">' + t('mpesaCode') + ' <span class="mute">' + t('optional') + '</span></label><input id="code" name="code" type="text" maxlength="12" autocapitalize="characters">' +
        '<button class="btn primary" type="submit">' + ic('check') + t('save') + '</button></form>';
    }
    return h + '<button class="btn ghost-red" data-act="delDebt" data-id="' + esc(d.id) + '">' + ic('trash') + t('del') + '</button>';
  };

  function monthData(ym) {
    var sales = S.sales.filter(function (s) { return monthOf(s.date) === ym; });
    var exps = S.expenses.filter(function (e) { return monthOf(e.date) === ym; });
    var biz = exps.filter(function (e) { return e.cat !== 'drawings'; });
    var r = {
      sales: sales, exps: exps,
      total: sum(sales, function (s) { return s.amount; }),
      mpesa: sum(sales.filter(function (s) { return s.method === 'mpesa'; }), function (s) { return s.amount; }),
      cash: sum(sales.filter(function (s) { return s.method === 'cash'; }), function (s) { return s.amount; }),
      credit: sum(sales.filter(function (s) { return s.method === 'credit'; }), function (s) { return s.amount; }),
      spent: sum(biz, function (e) { return e.amount; }),
      etims: sum(biz.filter(function (e) { return e.etims === 'yes' || e.etims === 'na'; }), function (e) { return e.amount; }),
      risk: sum(biz.filter(function (e) { return e.etims !== 'yes' && e.etims !== 'na'; }), function (e) { return e.amount; }),
      drawings: sum(exps.filter(function (e) { return e.cat === 'drawings'; }), function (e) { return e.amount; })
    };
    r.profit = Math.round((r.total - r.spent) * 100) / 100;
    r.tax = S.settings.regime === 'tot' ? Math.round(r.total * num(S.settings.taxRate)) / 100 : null;
    return r;
  }

  V.report = function () {
    var ym = ui.month, r = monthData(ym);
    function line(lbl, val, cls) { return '<div class="row"><div class="l">' + lbl + '</div><div class="r ' + (cls || '') + '">' + val + '</div></div>'; }
    var h = ptitle('chart', 'c-blue', t('report')) + '<div class="monthnav"><button data-act="month" data-v="-1" aria-label="previous">' + ic('left') + '</button>' +
      '<strong>' + monthName(ym) + '</strong><button data-act="month" data-v="1" aria-label="next">' + ic('right') + '</button></div>';
    h += '<div class="stats tiles"><div class="stat in"><div class="lbl">' + t('sales') + '</div><div class="val">' + money(r.total) + '</div></div>' +
      '<div class="stat out"><div class="lbl">' + t('expenses') + '</div><div class="val">' + money(r.spent) + '</div></div>' +
      '<div class="stat net"><div class="lbl">' + t('profit') + '</div><div class="val">' + money(r.profit) + '</div></div></div>';
    h += '<h2>💰 ' + t('sales') + '</h2><div class="card">' + line('📱 ' + t('mpesa'), money(r.mpesa)) + line('💵 ' + t('cash'), money(r.cash)) + line('📝 ' + t('creditUnpaid'), money(r.credit)) + '</div>';
    var pct = r.spent > 0 ? Math.round(r.etims / r.spent * 100) : 100;
    h += '<h2>🧾 eTIMS</h2><div class="card">' + line(t('etimsCover'), pct + '%', pct >= 90 ? 'pos' : 'neg') +
      '<div class="meter' + (pct >= 90 ? '' : ' low') + '"><span style="width:' + Math.max(0, Math.min(100, pct)) + '%"></span></div>' +
      line('⚠️ ' + t('atRisk'), money(r.risk), r.risk > 0 ? 'neg' : 'pos') + line('👛 ' + t('drawings'), money(r.drawings)) + '</div>';
    if (r.tax != null) h += '<div class="card">' + line('🏛️ ' + t('taxEst') + ' (' + esc(String(S.settings.taxRate)) + '%)', money(r.tax)) + '<p class="mute" style="padding-bottom:10px">' + t('taxNote') + '</p></div>';
    if (r.risk > 0) h += alertBox('red', 'alert', t('etimsWarn'));
    h += '<h2>📋 ' + t('entries') + '</h2>';
    var all = r.sales.map(function (s) { return { k: 's', o: s }; }).concat(r.exps.map(function (e) { return { k: 'e', o: e }; }));
    all.sort(function (a, b) { return (b.o.date + b.o.ts).localeCompare(a.o.date + a.o.ts); });
    if (!all.length) h += '<p class="empty"><span class="big-e">📭</span>' + t('noEntries') + '</p>';
    else {
      h += '<div class="card">';
      all.forEach(function (x) {
        var o = x.o, isS = x.k === 's';
        var desc = isS ? (o.item || t('sales')) + (o.name ? ' · ' + o.name : '') : catLabel(o.cat) + (o.supplier ? ' · ' + o.supplier : '');
        var tag = isS ? '' : (o.cat === 'drawings' ? '' : (o.etims === 'yes' ? ' <span class="badge green">eTIMS ✔</span>' : o.etims === 'na' ? '' : ' <span class="badge red">eTIMS ✖</span>'));
        h += '<div class="row"><span class="ricon ' + (isS ? 'in' : 'out') + '">' + ic(isS ? 'up' : 'down') + '</span><div class="l"><div>' + esc(desc) + '</div><div class="mute">' + fmtDate(o.date) + ' · ' + esc(methodLabel(o.method)) + (o.code ? ' · ' + esc(o.code) : '') + '</div>' + tag + '</div>' +
          '<div class="r ' + (isS ? 'pos' : 'neg') + '">' + money(o.amount) + '</div>' +
          (isS ? '<a class="icon-btn" href="#/receipt/' + esc(o.id) + '" aria-label="' + t('receipt') + '">' + ic('receipt') + '</a>' : '') +
          '<button class="icon-btn" data-act="del" data-k="' + x.k + '" data-id="' + esc(o.id) + '" aria-label="' + t('del') + '">' + ic('trash') + '</button></div>';
      });
      h += '</div>';
    }
    return h + '<button class="btn light" data-act="csv">' + ic('download') + t('exportCsv') + '</button>';
  };

  V.receipt = function (id) { ui.last = id; return V.saleDone(); };

  V.sms = function () {
    return ptitle('msg', 'c-purple', t('smsTitle')) + alertBox('blue', 'help', t('smsHelp')) +
      '<form id="f" data-form="sms" novalidate><textarea id="sms" name="sms" placeholder="SKL4ABC123 Confirmed. You have received Ksh1,500.00 from JOHN K 0712345678 on 8/11/26..."></textarea>' +
      (navigator.clipboard && navigator.clipboard.readText ? '<button type="button" class="btn light" data-act="pasteSms">' + ic('clip') + t('pasteFromPhone') + '</button>' : '') +
      '<button class="btn primary" type="submit">' + ic('search') + t('readSms') + '</button></form><div id="smsOut"></div>';
  };

  V.settings = function () {
    var st = S.settings;
    function sel(v, lbl) { return '<option value="' + v + '"' + (st.regime === v ? ' selected' : '') + '>' + lbl + '</option>'; }
    return ptitle('gear', 'c-slate', t('settings')) + '<form id="f" data-form="settings" novalidate>' +
      '<label class="f">' + t('language') + '</label><div class="choices two">' +
      choice('lang', 'sw', '🇰🇪', 'Kiswahili', st.lang === 'sw') + choice('lang', 'en', '🇬🇧', 'English', st.lang === 'en') + '</div>' +
      '<label class="f" for="bizName">' + t('bizName') + '</label><input id="bizName" name="bizName" type="text" maxlength="60" value="' + esc(st.bizName) + '">' +
      '<label class="f" for="phone">' + t('yourPhone') + '</label><input id="phone" name="phone" type="tel" maxlength="15" value="' + esc(st.phone) + '">' +
      '<label class="f" for="till">' + t('till') + '</label><input id="till" name="till" type="text" inputmode="numeric" maxlength="20" value="' + esc(st.till) + '">' +
      '<label class="f" for="kraPin">' + t('kraPin') + ' <span class="mute">' + t('optional') + '</span></label><input id="kraPin" name="kraPin" type="text" maxlength="11" autocapitalize="characters" value="' + esc(st.kraPin) + '">' +
      '<label class="f" for="regime">' + t('taxRegime') + '</label><select id="regime" name="regime">' +
      sel('tot', t('tot')) + sel('income', t('incomeTax')) + sel('vat', t('vat')) + sel('unsure', t('notSure')) + '</select>' +
      '<label class="f" for="taxRate">' + t('taxRate') + '</label><input id="taxRate" name="taxRate" type="text" inputmode="decimal" value="' + esc(String(st.taxRate)) + '">' +
      '<p class="mute">' + t('taxNote') + '</p>' +
      '<button class="btn primary" type="submit">' + ic('check') + t('save') + '</button></form>' +
      '<h2>💾 ' + t('backup') + '</h2><button class="btn blue" data-act="backup">' + ic('download') + t('backupNow') + '</button>' +
      '<label class="btn light" for="restoreFile" style="cursor:pointer">' + ic('upload') + t('restore') + '</label>' +
      '<input id="restoreFile" type="file" accept=".json,application/json" hidden>' +
      '<h2>⚠️ ' + t('danger') + '</h2><button class="btn ghost-red" data-act="wipe">' + ic('trash') + t('wipe') + '</button>' +
      '<p class="mute" style="text-align:center">Biashara Records v' + APP_VERSION + '</p>';
  };

  V.help = function () {
    var sw = S.settings.lang !== 'en';
    var tips = sw ? [
      ['➕', '<b>Nimeuza</b>: kila ukiuza, andika kiasi na jinsi mteja alivyolipa.'],
      ['➖', '<b>Nimetumia</b>: kila ukilipa kitu cha biashara, kiandike. Omba invoice ya eTIMS.'],
      ['📝', '<b>Madeni</b>: mteja akichukua kwa deni, chagua "Deni". Utaona wanaokudai na kuwakumbusha kwa WhatsApp.'],
      ['📩', '<b>SMS ya M-Pesa</b>: nakili ujumbe wa M-Pesa na ubandike. App itajaza kiasi na namba.'],
      ['📊', '<b>Ripoti</b>: mwisho wa mwezi angalia mauzo, matumizi, faida na makadirio ya kodi.'],
      ['💾', '<b>Nakala</b>: kila wiki bonyeza "Pakua nakala" na uiweke salama (Google Drive au WhatsApp kwako mwenyewe).'],
      ['👛', 'Pesa unayojichukulia mwenyewe, iandike kama "Pesa yangu binafsi". Si gharama ya biashara.'],
      ['🔒', 'Rekodi zako ziko kwenye simu hii tu. Hakuna mtu mwingine anayeziona.']
    ] : [
      ['➕', '<b>I sold</b>: every time you sell, type the amount and how the customer paid.'],
      ['➖', '<b>I spent</b>: every time you pay for something for the business, record it. Ask for an eTIMS invoice.'],
      ['📝', '<b>Debts</b>: if a customer takes goods on credit, choose "Credit". You will see who owes you and can remind them on WhatsApp.'],
      ['📩', '<b>M-Pesa SMS</b>: copy the M-Pesa message and paste it. The app fills in the amount and code.'],
      ['📊', '<b>Report</b>: at month end, check sales, expenses, profit and the tax estimate.'],
      ['💾', '<b>Backup</b>: every week tap "Download backup" and keep it safe (Google Drive, or WhatsApp it to yourself).'],
      ['👛', 'Money you take for yourself: record it as "Personal use". It is not a business cost.'],
      ['🔒', 'Your records stay on this phone only. Nobody else can see them.']
    ];
    var h = ptitle('help', 'c-green', t('helpTitle')) + '<div class="card"><ul class="tips">';
    tips.forEach(function (x) { h += '<li><span class="e">' + x[0] + '</span><span>' + x[1] + '</span></li>'; });
    return h + '</ul></div>' + alertBox('blue', 'phone', t('iosInstall')) +
      alertBox('orange', 'help', t('disclaimer') + ' <a href="https://www.kra.go.ke" target="_blank" rel="noopener">kra.go.ke</a>') +
      '<a class="btn primary" href="#/">' + ic('home') + t('home') + '</a>';
  };

  function findById(arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; }

  // ------------------------------------------------------------------ router
  var TABS = [['home', '#/', 'home'], ['debts', '#/debts', 'book'], ['report', '#/report', 'chart'], ['settings', '#/settings', 'gear']];
  var TAB_OF = { home: 'home', debts: 'debts', debt: 'debts', newdebt: 'debts', report: 'report', receipt: 'report', settings: 'settings' };
  function render() {
    var app = document.getElementById('app');
    var parts = (location.hash || '#/').replace(/^#\/?/, '').split('/');
    var view = parts[0] || 'home', arg = decodeURIComponent(parts[1] || '');
    if (!S.settings.lang) view = 'lang';
    if (!V[view]) view = 'home';
    document.documentElement.lang = S.settings.lang === 'en' ? 'en' : 'sw';
    document.getElementById('backBtn').hidden = view === 'home' || view === 'lang';
    document.getElementById('brand').textContent = S.settings.bizName || 'Biashara Records';
    var bar = document.getElementById('tabbar');
    bar.hidden = view === 'lang';
    var active = TAB_OF[view] || '';
    bar.innerHTML = TABS.map(function (x) {
      return '<a class="tab' + (x[0] === active ? ' on' : '') + '" href="' + x[1] + '"><span class="tw">' + ic(x[2]) + '</span>' + t(x[0]) + '</a>';
    }).join('');
    app.innerHTML = V[view](arg);
    if (view !== 'sale' && view !== 'expense') ui.draft = null;
    window.scrollTo(0, 0);
    var amt = document.getElementById('amount');
    if (amt && (view === 'sale' || view === 'expense') && !amt.value) { try { amt.focus(); } catch (e) { /* ignore */ } }
  }

  // ------------------------------------------------------------------ actions
  function formVals(form) {
    var o = {}, els = form.elements;
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; if (!el.name) continue;
      if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; }
      else o[el.name] = (el.value || '').trim();
    }
    return o;
  }
  function cleanCode(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); }
  function validDate(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : today(); }

  var submitters = {
    sale: function (v) {
      var amount = num(v.amount);
      if (amount <= 0) return toast(t('enterAmount'));
      var name = v.method === 'credit' ? v.cust : v.custAny;
      if (v.method === 'credit' && !name) return toast(t('enterName'));
      S.counter = (S.counter || 0) + 1;
      var s = { id: uid(), no: S.counter, date: validDate(v.date), ts: String(Date.now()), amount: amount, item: v.item, method: v.method || 'cash',
        code: v.method === 'mpesa' ? cleanCode(v.code) : '', name: name || '', phone: v.phone || '' };
      S.sales.push(s);
      if (s.method === 'credit') S.debts.push({ id: uid(), saleId: s.id, date: s.date, name: name, phone: s.phone, item: s.item, amount: amount, due: v.due || '', payments: [] });
      if (persist()) { ui.last = s.id; ui.draft = null; go('#/saleDone'); }
    },
    expense: function (v) {
      var amount = num(v.amount);
      if (amount <= 0) return toast(t('enterAmount'));
      var e = { id: uid(), date: validDate(v.date), ts: String(Date.now()), amount: amount, cat: v.cat || 'other', supplier: v.supplier,
        pin: String(v.pin || '').toUpperCase(), etims: v.cat === 'drawings' ? 'na' : (v.etims || 'no'), method: v.method || 'cash',
        code: v.method === 'mpesa' ? cleanCode(v.code) : '', phone: (ui.draft && ui.draft.phone) || '' };
      S.expenses.push(e);
      if (persist()) { ui.last = e.id; ui.draft = null; go('#/expenseDone'); }
    },
    debt: function (v) {
      var amount = num(v.amount);
      if (!v.cust) return toast(t('enterName'));
      if (amount <= 0) return toast(t('enterAmount'));
      S.debts.push({ id: uid(), saleId: '', date: today(), name: v.cust, phone: v.phone, item: v.item, amount: amount, due: v.due || '', payments: [] });
      if (persist()) { toast(t('debtSaved')); go('#/debts'); }
    },
    pay: function (v, form) {
      var d = findById(S.debts, form.getAttribute('data-id')); if (!d) return;
      var amount = num(v.amount);
      if (amount <= 0) return toast(t('enterAmount'));
      if (amount > debtBalance(d) + 0.001) return toast(t('payTooBig'));
      d.payments = d.payments || [];
      d.payments.push({ date: today(), amount: amount, method: v.method || 'cash', code: v.method === 'mpesa' ? cleanCode(v.code) : '' });
      if (persist()) { toast(t('saved')); render(); }
    },
    settings: function (v) {
      var st = S.settings;
      st.lang = v.lang === 'en' ? 'en' : 'sw'; st.bizName = v.bizName; st.phone = v.phone; st.till = v.till;
      st.kraPin = String(v.kraPin || '').toUpperCase(); st.regime = v.regime || 'tot';
      var rate = num(v.taxRate); st.taxRate = rate >= 0 && rate <= 100 ? rate : 0;
      if (persist()) { toast(t('saved')); go('#/'); }
    },
    sms: function (v) {
      var r = parseMpesa(v.sms), out = document.getElementById('smsOut');
      if (!r) { out.innerHTML = alertBox('orange', 'alert', t('smsFail')); return; }
      ui.pending = r;
      var h = '<div class="card"><div class="row"><div class="l">' + t('amount') + '</div><div class="r">' + money(r.amount) + '</div></div>' +
        (r.code ? '<div class="row"><div class="l">M-Pesa</div><div class="r">' + esc(r.code) + '</div></div>' : '') +
        (r.name ? '<div class="row"><div class="l">' + (r.dir === 'out' ? t('to') : t('from')) + '</div><div class="r">' + esc(r.name) + '</div></div>' : '') + '</div>';
      if (r.dir === 'in') h += '<p><b>' + t('smsIn') + '</b></p>';
      if (r.dir === 'out') h += '<p><b>' + t('smsOut') + '</b></p>';
      h += '<button class="btn primary" data-act="smsUse" data-v="sale">' + ic('up') + t('asSale') + '</button>' +
        '<button class="btn danger" data-act="smsUse" data-v="expense">' + ic('down') + t('asExpense') + '</button>';
      out.innerHTML = h;
    }
  };

  function download(name, text, type) {
    var blob = new Blob([text], { type: type });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.parentNode.removeChild(a); }, 1000);
  }
  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
    return '"' + s.replace(/"/g, '""') + '"';
  }

  var actions = {
    setLang: function (el) { S.settings.lang = el.getAttribute('data-v'); persist(); go('#/settings'); },
    fill: function (el) { var f = document.getElementById(el.getAttribute('data-target')); if (f) f.value = el.getAttribute('data-v'); },
    print: function () { window.print(); },
    month: function (el) { ui.month = shiftMonth(ui.month, parseInt(el.getAttribute('data-v'), 10)); render(); },
    install: function () { var e = ui.installEvt; if (e) { e.prompt(); ui.installEvt = null; render(); } },
    del: function (el) {
      if (!window.confirm(t('confirmDel'))) return;
      var id = el.getAttribute('data-id');
      if (el.getAttribute('data-k') === 's') {
        S.sales = S.sales.filter(function (s) { return s.id !== id; });
        S.debts = S.debts.filter(function (d) { return d.saleId !== id; });
      } else S.expenses = S.expenses.filter(function (e) { return e.id !== id; });
      persist(); toast(t('deleted')); render();
    },
    delDebt: function (el) {
      if (!window.confirm(t('confirmDel'))) return;
      var id = el.getAttribute('data-id');
      S.debts = S.debts.filter(function (d) { return d.id !== id; });
      persist(); toast(t('deleted')); go('#/debts');
    },
    backup: function () {
      S.lastBackup = Date.now(); persist();
      download('biashara-backup-' + today() + '.json', JSON.stringify(S, null, 1), 'application/json');
      toast(t('backupDone')); render();
    },
    csv: function () {
      var r = monthData(ui.month), rows = [['Type', 'Date', 'No', 'Description', 'Category', 'Customer/Supplier', 'Phone', 'Supplier KRA PIN', 'Amount', 'Payment', 'M-Pesa code', 'eTIMS invoice']];
      r.sales.forEach(function (s) { rows.push(['Sale', s.date, s.no, s.item, '', s.name, s.phone, '', s.amount, s.method, s.code, '']); });
      r.exps.forEach(function (e) { rows.push(['Expense', e.date, '', '', catLabel(e.cat).replace(/^\S+ /, ''), e.supplier, e.phone, e.pin, e.amount, e.method, e.code, e.etims]); });
      download('biashara-' + ui.month + '.csv', '﻿' + rows.map(function (row) { return row.map(csvCell).join(','); }).join('\r\n'), 'text/csv');
    },
    wipe: function () {
      if (!window.confirm(t('wipeConfirm'))) return;
      var word = S.settings.lang === 'en' ? 'DELETE' : 'FUTA';
      var typed = window.prompt(t('wipeConfirm2'));
      if (typed == null || typed.trim().toUpperCase() !== word) return;
      var lang = S.settings.lang; S = blank(); S.settings.lang = lang; persist(); toast(t('deleted')); go('#/');
    },
    pasteSms: function () {
      navigator.clipboard.readText().then(function (x) { document.getElementById('sms').value = x; }, function () { /* permission denied */ });
    },
    smsUse: function (el) {
      var r = ui.pending || {}, kind = el.getAttribute('data-v');
      ui.draft = { kind: kind, amount: r.amount ? String(r.amount) : '', code: r.code, name: r.name, phone: r.phone, method: 'mpesa' };
      go('#/' + kind);
    }
  };

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!el) return;
    var a = actions[el.getAttribute('data-act')];
    if (a) { ev.preventDefault(); a(el); }
  });
  document.addEventListener('submit', function (ev) {
    var form = ev.target, kind = form.getAttribute('data-form');
    if (!kind || !submitters[kind]) return;
    ev.preventDefault();
    submitters[kind](formVals(form), form);
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el.name === 'method') {
      var mb = document.getElementById('mpesaBox'), cb = document.getElementById('creditBox');
      if (mb) mb.hidden = el.value !== 'mpesa';
      if (cb) cb.hidden = el.value !== 'credit';
    }
    if (el.name === 'etims') { var w = document.getElementById('etimsWarn'); if (w) w.hidden = el.value !== 'no'; }
    if (el.name === 'cat') { var eb = document.getElementById('etimsBox'); if (eb) eb.hidden = el.value === 'drawings'; }
    if (el.id === 'restoreFile' && el.files && el.files[0]) {
      var fr = new FileReader();
      fr.onload = function () {
        var d; try { d = JSON.parse(fr.result); } catch (e) { d = null; }
        if (!valid(d)) { toast(t('badFile')); return; }
        if (!window.confirm(t('restoreConfirm'))) return;
        S = d; S.lastBackup = Date.now(); persist(); toast(t('restored')); go('#/');
      };
      fr.readAsText(el.files[0]);
      el.value = '';
    }
  });
  document.getElementById('backBtn').addEventListener('click', function () {
    if (history.length > 1) history.back(); else go('#/');
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); ui.installEvt = e; if (/^#?\/?$/.test(location.hash)) render(); });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* offline support unavailable */ }); });
  }

  // expose parser for automated tests only
  window.__biashara = { parseMpesa: parseMpesa, intlPhone: intlPhone };
  render();
})();
