import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:3001/api/public/apps';
const WRITE_KEY = 'Basic M2M3NmQxZTgtMjBmNy00OWI2LTg5NzUtZTNhMmE5MmJiZmExOmIyNDExZWMyM2Y0NDY3NWY=';

const STATES = ['CA', 'TX', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'MO', 'AZ', 'WA', 'CO', 'TN'];
const CITIES = ['Los Angeles', 'Houston', 'Miami', 'New York', 'Chicago', 'Philadelphia', 'Columbus', 'Atlanta', 'Charlotte', 'Detroit', 'Florissant', 'Phoenix', 'Seattle', 'Denver', 'Nashville'];
const STATUS_CODES = ['NEW', 'ACTIVE', 'PENDING', 'CLOSED', 'PAID'];
const FIRST_NAMES = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma', 'Robert', 'Olivia'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomTimestamp = (): string => {
  const day = randomInt(3, 10);
  const hour = randomInt(0, 23);
  const minute = randomInt(0, 59);
  return `2025-12-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:05.985574+0000`;
};

// IDENTIFY API - tạo user với traits (đúng format)
async function identifyUser(userId: string) {
  const debtId = randomInt(110000000, 119999999);
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const state = randomItem(STATES);
  const status = randomItem(STATUS_CODES);
  
  try {
    await axios.post(`${API_BASE}/identify`, {
      userId,
      timestamp: randomTimestamp(),
      traits: {
        // Standard traits
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        firstName,
        lastName,
        // Account traits (theo mẫu của bạn)
        account_debtID: debtId,
        account_customerAccountNumber: debtId.toString(),
        account_clientID: randomInt(4000000, 4999999),
        account_currentBalance: randomInt(100, 10000),
        account_lastPaymentAmount: randomInt(0, 500),
        account_debtStatusCodeGroup: status,
        account_inLegal: Math.random() < 0.1,
        account_originalCreditorName: `Auto ${randomItem(['O.Creditor', 'Bank', 'Finance'])}`,
        account_activePhoneNumbers: randomInt(1, 5),
        account_mobilePhoneNumbers: randomInt(0, 3),
        account_active: Math.random() > 0.3,
        account_disputed: Math.random() < 0.15,
        account_disputeResolved: Math.random() < 0.1,
        account_doNotEmail: Math.random() < 0.1,
        account_doNotTxt: Math.random() < 0.1,
        account_isVerified: Math.random() > 0.3,
        account_isBankrupt: Math.random() < 0.05,
        account_isDeceased: Math.random() < 0.02,
        account_isRemoved: Math.random() < 0.05,
        account_demographics_PRIMARY_firstName: firstName,
        account_demographics_PRIMARY_lastName: lastName,
        account_demographics_PRIMARY_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        account_demographics_PRIMARY_litigious: Math.random() < 0.05,
        account_demographics_PRIMARY_contactWindowOpen: Math.random() > 0.5,
        account_state: state,
        account_city: randomItem(CITIES),
        account_postal_code: randomInt(10000, 99999).toString(),
      },
      messageId: uuidv4()
    }, { headers: { 'Content-Type': 'application/json', 'Authorization': WRITE_KEY } });
    return true;
  } catch { return false; }
}

// TRACK API - ACCOUNT_CREATED_FROM_WORKSHEET (theo đúng mẫu của bạn)
async function trackAccountCreated(userId: string) {
  const debtId = randomInt(110000000, 119999999);
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  
  try {
    await axios.post(`${API_BASE}/track`, {
      event: "ACCOUNT_CREATED_FROM_WORKSHEET",
      userId,
      timestamp: randomTimestamp(),
      properties: {
        account_debtID: debtId,
        account_customerAccountNumber: debtId.toString(),
        account_clientID: randomInt(4000000, 4999999),
        account_currentBalance: randomInt(100, 10000),
        account_lastPaymentAmount: randomInt(0, 500),
        account_debtStatusCodeGroup: randomItem(STATUS_CODES),
        account_inLegal: Math.random() < 0.1,
        account_originalCreditorName: `Auto ${randomItem(['O.Creditor', 'Bank', 'Finance'])}`,
        account_activePhoneNumbers: randomInt(1, 5),
        account_mobilePhoneNumbers: randomInt(0, 3),
        account_active: Math.random() > 0.3,
        account_disputed: Math.random() < 0.15,
        account_disputeResolved: Math.random() < 0.1,
        account_doNotEmail: Math.random() < 0.1,
        account_doNotTxt: Math.random() < 0.1,
        account_isVerified: Math.random() > 0.3,
        account_isBankrupt: Math.random() < 0.05,
        account_isDeceased: Math.random() < 0.02,
        account_isRemoved: Math.random() < 0.05,
        account_demographics_PRIMARY_firstName: firstName,
        account_demographics_PRIMARY_lastName: lastName,
        account_demographics_PRIMARY_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        account_demographics_PRIMARY_litigious: Math.random() < 0.05,
        account_demographics_PRIMARY_contactWindowOpen: Math.random() > 0.5,
        account_magic_link_url: null
      },
      messageId: uuidv4()
    }, { headers: { 'Content-Type': 'application/json', 'Authorization': WRITE_KEY } });
    return true;
  } catch { return false; }
}

// TRACK API - INBOUND_CALL_CONNECTED (theo đúng mẫu của bạn)
async function trackInboundCall(userId: string) {
  const callId = uuidv4().replace(/-/g, '').substring(0, 22);
  try {
    await axios.post(`${API_BASE}/track`, {
      event: "INBOUND_CALL_CONNECTED",
      userId,
      timestamp: randomTimestamp(),
      properties: {
        inbound_call_id: randomInt(1000, 9999),
        inbound_call_call_id: callId,
        inbound_call_telco_call_id: `CT${uuidv4().replace(/-/g, '').substring(0, 30)}`,
        inbound_call_dialer_call_sid: randomInt(100000000, 999999999).toString(),
        inbound_call_customer_id: parseInt(userId),
        inbound_call_account_id: parseInt(userId),
        inbound_call_vendor_id: randomInt(1, 10),
        inbound_call_phone_number: `${randomInt(100, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`,
        inbound_call_country_code: "+1",
        inbound_call_call_status: randomItem(["new", "answered", "completed"]),
        inbound_call_action: randomItem(["accept", "reject", "voicemail"]),
        inbound_call_telco_provider: "twilio",
        inbound_call_direction: "inbound",
        inbound_call_debt_id: randomInt(110000000, 119999999).toString(),
        inbound_call_is_passed_rpc: Math.random() > 0.7,
        inbound_call_created_at: randomTimestamp(),
        inbound_call_report_status: randomItem(["success", "failed", "pending"]),
        inbound_call_report_call_code: randomItem(["SIF", "WN", "AM", "NA"]),
        account_id: parseInt(userId),
        account_status: randomItem(STATUS_CODES),
        account_state: randomItem(STATES),
        version: 1
      },
      messageId: uuidv4()
    }, { headers: { 'Content-Type': 'application/json', 'Authorization': WRITE_KEY } });
    return true;
  } catch { return false; }
}

// TRACK API - Other events
async function trackOtherEvent(userId: string, event: string) {
  try {
    await axios.post(`${API_BASE}/track`, {
      event,
      userId,
      timestamp: randomTimestamp(),
      properties: {
        account_id: parseInt(userId),
        account_status: randomItem(STATUS_CODES),
        account_currentBalance: randomInt(100, 10000),
        account_state: randomItem(STATES),
        source: "automation",
        amount: randomInt(0, 1000),
        version: 1
      },
      messageId: uuidv4()
    }, { headers: { 'Content-Type': 'application/json', 'Authorization': WRITE_KEY } });
    return true;
  } catch { return false; }
}

const OTHER_EVENTS = ['PAYMENT_MADE', 'EMAIL_OPENED', 'EMAIL_CLICKED', 'LOGIN', 'PROFILE_UPDATED', 
  'OUTBOUND_CALL_CONNECTED', 'SMS_SENT', 'SMS_DELIVERED', 'PAYMENT_SCHEDULED', 'DISPUTE_FILED', 
  'DISPUTE_RESOLVED', 'BALANCE_UPDATED', 'DOCUMENT_UPLOADED'];

async function main() {
  console.log('='.repeat(60));
  console.log('CREATING DATA WITH IDENTIFY + TRACK (CORRECT FORMAT)');
  console.log('='.repeat(60));
  
  // Step 1: Identify 2000 users
  console.log('\n📝 Step 1: IDENTIFY 2000 users (với traits)...');
  let identifyOk = 0;
  for (let i = 1; i <= 2000; i++) {
    if (await identifyUser((1000 + i).toString())) identifyOk++;
    if (i % 100 === 0) console.log(`  Identify: ${i}/2000 (${identifyOk} ok)`);
  }
  console.log(`✅ Identify: ${identifyOk}/2000`);

  // Step 2: Track ACCOUNT_CREATED_FROM_WORKSHEET for each user
  console.log('\n📝 Step 2: TRACK ACCOUNT_CREATED_FROM_WORKSHEET (2000)...');
  let accountOk = 0;
  for (let i = 1; i <= 2000; i++) {
    if (await trackAccountCreated((1000 + i).toString())) accountOk++;
    if (i % 100 === 0) console.log(`  Account: ${i}/2000 (${accountOk} ok)`);
  }
  console.log(`✅ Account events: ${accountOk}/2000`);

  // Step 3: Track INBOUND_CALL_CONNECTED
  console.log('\n📝 Step 3: TRACK INBOUND_CALL_CONNECTED (1500)...');
  let callOk = 0;
  for (let i = 1; i <= 1500; i++) {
    const userId = (1001 + Math.floor(Math.random() * 2000)).toString();
    if (await trackInboundCall(userId)) callOk++;
    if (i % 100 === 0) console.log(`  Calls: ${i}/1500 (${callOk} ok)`);
  }
  console.log(`✅ Call events: ${callOk}/1500`);

  // Step 4: Track other events
  console.log('\n📝 Step 4: TRACK other events (2500)...');
  let otherOk = 0;
  for (let i = 1; i <= 2500; i++) {
    const userId = (1001 + Math.floor(Math.random() * 2000)).toString();
    if (await trackOtherEvent(userId, randomItem(OTHER_EVENTS))) otherOk++;
    if (i % 200 === 0) console.log(`  Other: ${i}/2500 (${otherOk} ok)`);
  }
  console.log(`✅ Other events: ${otherOk}/2500`);

  console.log('\n' + '='.repeat(60));
  console.log(`DONE! Total: ${identifyOk} identifies + ${accountOk + callOk + otherOk} track events`);
  console.log('='.repeat(60));
}

main().catch(console.error);

