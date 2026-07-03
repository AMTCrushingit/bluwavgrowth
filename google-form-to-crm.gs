/**
 * BluWav Caribbean — Google Form → Supabase CRM Bridge
 * =====================================================
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Form → click ⋮ → Script editor
 * 2. Paste this entire file into Code.gs
 * 3. Replace SUPABASE_URL and SUPABASE_ANON_KEY below
 * 4. Run setupTrigger() once manually to register the form trigger
 * 5. Authorize the script when prompted
 *
 * SUPABASE TABLE REQUIRED (run in Supabase SQL editor):
 *   CREATE TABLE leads (
 *     id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     full_name   text,
 *     business    text,
 *     whatsapp    text,
 *     email       text,
 *     interest    text,
 *     island      text,
 *     source      text DEFAULT 'google_form',
 *     status      text DEFAULT 'new',
 *     raw_response jsonb,
 *     created_at  timestamptz DEFAULT now()
 *   );
 *   -- Enable Row Level Security
 *   ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
 *   -- Allow anon inserts (form submissions)
 *   CREATE POLICY "allow_anon_insert" ON leads FOR INSERT TO anon WITH CHECK (true);
 */

// ── CONFIG — replace these once Supabase recovers ──────────────────────────
var SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';  // e.g. https://abcxyz.supabase.co
var SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';                     // Settings → API → anon/public key

// ── FIELD MAPPING — update to match your Google Form question titles ────────
// Run logFormFields() first to see your exact field names
var FIELD_MAP = {
  full_name : 'Your Name',           // exact question title in your form
  business  : 'Business Name',
  whatsapp  : 'WhatsApp Number',
  email     : 'Email Address',
  interest  : 'I need help with',
  island    : 'Which island are you based on?'  // optional — remove if not in form
};

// ── MAIN TRIGGER — fires on every form submission ───────────────────────────
function onFormSubmit(e) {
  try {
    var response  = e.response;
    var answers   = response.getItemResponses();
    var timestamp = response.getTimestamp().toISOString();

    // Build a lookup map: question title → answer
    var answerMap = {};
    answers.forEach(function(item) {
      answerMap[item.getItem().getTitle()] = item.getResponse();
    });

    // Map to CRM fields
    var lead = {
      full_name   : answerMap[FIELD_MAP.full_name]  || '',
      business    : answerMap[FIELD_MAP.business]   || '',
      whatsapp    : answerMap[FIELD_MAP.whatsapp]   || '',
      email       : answerMap[FIELD_MAP.email]      || '',
      interest    : answerMap[FIELD_MAP.interest]   || 'Health Check',
      island      : answerMap[FIELD_MAP.island]     || '',
      source      : 'google_form',
      status      : 'new',
      raw_response: answerMap,
      created_at  : timestamp
    };

    // POST to Supabase
    var result = postToSupabase(lead);
    Logger.log('Lead saved to Supabase: ' + JSON.stringify(result));

    // Send WhatsApp notification via wa.me link logged to console
    // (for automated WA, integrate Twilio or WhatsApp Business API separately)
    var waText = 'New lead from Google Form!\n\n'
      + 'Name: '     + lead.full_name + '\n'
      + 'Business: ' + lead.business  + '\n'
      + 'WhatsApp: ' + lead.whatsapp  + '\n'
      + 'Interest: ' + lead.interest  + '\n'
      + 'Island: '   + lead.island    + '\n'
      + 'Time: '     + timestamp;
    Logger.log('WA Notification text:\n' + waText);

  } catch(err) {
    Logger.log('ERROR in onFormSubmit: ' + err.toString());
    // Optionally email yourself on error:
    // MailApp.sendEmail('hello@bluwavgrowth.com', 'CRM Error', err.toString());
  }
}

// ── SUPABASE POST ───────────────────────────────────────────────────────────
function postToSupabase(lead) {
  var options = {
    method      : 'post',
    contentType : 'application/json',
    headers     : {
      'apikey'       : SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Prefer'       : 'return=minimal'
    },
    payload     : JSON.stringify(lead),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/leads', options);
  var code     = response.getResponseCode();

  if (code !== 201 && code !== 200) {
    throw new Error('Supabase returned ' + code + ': ' + response.getContentText());
  }
  return { status: code };
}

// ── SETUP: run this ONCE manually to register the trigger ──────────────────
function setupTrigger() {
  // Remove any existing triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Get the form linked to this script
  var form = FormApp.getActiveForm();
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('Trigger registered for form: ' + form.getTitle());
}

// ── DEBUG: run this to see your form field names ───────────────────────────
function logFormFields() {
  var form  = FormApp.getActiveForm();
  var items = form.getItems();
  Logger.log('Form: ' + form.getTitle());
  items.forEach(function(item) {
    Logger.log('  [' + item.getType() + '] "' + item.getTitle() + '"');
  });
}

// ── TEST: run this to send a dummy lead to Supabase ───────────────────────
function testSupabaseConnection() {
  var testLead = {
    full_name  : 'Test User',
    business   : 'Test Business TT',
    whatsapp   : '+18680000000',
    email      : 'test@bluwavgrowth.com',
    interest   : 'Health Check',
    island     : 'Trinidad',
    source     : 'test',
    status     : 'test',
    created_at : new Date().toISOString()
  };
  try {
    var result = postToSupabase(testLead);
    Logger.log('SUCCESS: ' + JSON.stringify(result));
  } catch(err) {
    Logger.log('FAILED: ' + err.toString());
  }
}
