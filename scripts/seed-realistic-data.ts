/**
 * Dittofeed Realistic Data Seeder
 * 
 * Tạo dữ liệu thực tế cho Dittofeed bao gồm:
 * - ~2000 users (qua identify API)
 * - ~5000 events (qua track API) 
 * - ~50 segments
 * - ~20 journeys
 */

import { randomUUID } from 'crypto';

// Configuration
const CONFIG = {
  API_BASE_URL: 'http://localhost:3001',
  WRITE_KEY: 'Basic M2M3NmQxZTgtMjBmNy00OWI2LTg5NzUtZTNhMmE5MmJiZmExOmIyNDExZWMyM2Y0NDY3NWY=',
  WORKSPACE_ID: '6086a1d3-1138-4a50-87d8-6b7721e263e8',
  
  // Số lượng data cần tạo
  NUM_USERS: 2000,
  NUM_EVENTS: 5000,
  NUM_SEGMENTS: 50,
  NUM_JOURNEYS: 20,
  
  // Batch size cho API calls
  BATCH_SIZE: 100,
};

// ============ DATA GENERATORS ============

// States for user location
const US_STATES = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 
                   'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI'];

const CITIES_BY_STATE: Record<string, string[]> = {
  'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
  'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  'NY': ['New York', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  'IL': ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Joliet'],
  // ... more can be added
};

// Debt status codes
const DEBT_STATUS_CODES = ['NEW', 'ACTIVE', 'PENDING', 'LEGAL', 'SETTLED', 'CLOSED'];

// Event types for tracking
const EVENT_TYPES = [
  'ACCOUNT_CREATED_FROM_WORKSHEET',
  'INBOUND_CALL_CONNECTED',
  'OUTBOUND_CALL_CONNECTED', 
  'PAYMENT_MADE',
  'PAYMENT_SCHEDULED',
  'EMAIL_OPENED',
  'EMAIL_CLICKED',
  'SMS_SENT',
  'SMS_DELIVERED',
  'LOGIN',
  'PROFILE_UPDATED',
  'DOCUMENT_UPLOADED',
  'DISPUTE_FILED',
  'DISPUTE_RESOLVED',
  'BALANCE_UPDATED',
];

// First names
const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'];

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

// ============ HELPER FUNCTIONS ============

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));
  return date.toISOString();
}

function generateEmail(firstName: string, lastName: string, userId: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${userId.slice(-4)}@${randomElement(domains)}`;
}

function generatePhoneNumber(): string {
  return `${randomInt(200, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`;
}

// ============ USER GENERATION ============

interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  city: string;
  balance: number;
  debtStatus: string;
  isActive: boolean;
  createdAt: string;
}

function generateUser(index: number): UserData {
  const userId = String(1000 + index);
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const state = randomElement(US_STATES);
  const cities = CITIES_BY_STATE[state] || ['Unknown'];
  
  return {
    userId,
    firstName,
    lastName,
    email: generateEmail(firstName, lastName, userId),
    state,
    city: randomElement(cities),
    balance: randomInt(100, 50000),
    debtStatus: randomElement(DEBT_STATUS_CODES),
    isActive: Math.random() > 0.2,
    createdAt: randomDate(90),
  };
}

function createIdentifyPayload(user: UserData) {
  return {
    userId: user.userId,
    timestamp: user.createdAt,
    messageId: randomUUID(),
    traits: {
      account_debtID: randomInt(100000000, 999999999),
      account_customerAccountNumber: String(randomInt(100000000, 999999999)),
      account_clientID: randomInt(1000000, 9999999),
      account_currentBalance: user.balance,
      account_lastPaymentAmount: randomInt(0, user.balance / 10),
      account_debtStatusCodeGroup: user.debtStatus,
      account_inLegal: user.debtStatus === 'LEGAL',
      account_originalCreditorName: `Creditor ${randomInt(1, 100)}`,
      account_activePhoneNumbers: randomInt(1, 5),
      account_mobilePhoneNumbers: randomInt(1, 3),
      account_active: user.isActive,
      account_disputed: Math.random() > 0.9,
      account_disputeResolved: false,
      account_doNotEmail: Math.random() > 0.95,
      account_doNotTxt: Math.random() > 0.95,
      account_isVerified: Math.random() > 0.3,
      account_isBankrupt: Math.random() > 0.95,
      account_isDeceased: false,
      account_isRemoved: false,
      account_demographics_PRIMARY_firstName: user.firstName,
      account_demographics_PRIMARY_lastName: user.lastName,
      account_demographics_PRIMARY_email: user.email,
      account_demographics_PRIMARY_litigious: Math.random() > 0.9,
      account_demographics_PRIMARY_contactWindowOpen: Math.random() > 0.5,
      account_state: user.state,
      account_city: user.city,
      account_phone: generatePhoneNumber(),
    },
  };
}

// ============ EVENT GENERATION ============

function createTrackPayload(userId: string, eventType: string, timestamp: string) {
  const baseProperties: Record<string, unknown> = {
    version: 1,
    timestamp,
  };

  // Add event-specific properties
  switch (eventType) {
    case 'INBOUND_CALL_CONNECTED':
    case 'OUTBOUND_CALL_CONNECTED':
      Object.assign(baseProperties, {
        call_id: randomInt(1000, 9999),
        call_duration_seconds: randomInt(30, 600),
        call_status: randomElement(['completed', 'no_answer', 'busy', 'voicemail']),
        call_recording_url: `https://recordings.example.com/${randomUUID()}.wav`,
      });
      break;
      
    case 'PAYMENT_MADE':
    case 'PAYMENT_SCHEDULED':
      Object.assign(baseProperties, {
        payment_amount: randomInt(50, 5000),
        payment_method: randomElement(['card', 'bank_transfer', 'check']),
        payment_id: randomUUID(),
        payment_status: eventType === 'PAYMENT_MADE' ? 'completed' : 'pending',
      });
      break;
      
    case 'EMAIL_OPENED':
    case 'EMAIL_CLICKED':
      Object.assign(baseProperties, {
        email_template_id: randomUUID(),
        email_campaign: randomElement(['welcome', 'reminder', 'followup', 'promotion']),
        email_subject: 'Important Update',
      });
      break;
      
    case 'SMS_SENT':
    case 'SMS_DELIVERED':
      Object.assign(baseProperties, {
        sms_template_id: randomUUID(),
        sms_status: randomElement(['sent', 'delivered', 'failed']),
      });
      break;
      
    case 'LOGIN':
      Object.assign(baseProperties, {
        login_method: randomElement(['email', 'phone', 'sso']),
        device_type: randomElement(['mobile', 'desktop', 'tablet']),
        browser: randomElement(['Chrome', 'Safari', 'Firefox', 'Edge']),
      });
      break;
      
    case 'BALANCE_UPDATED':
      Object.assign(baseProperties, {
        previous_balance: randomInt(100, 50000),
        new_balance: randomInt(100, 50000),
        update_reason: randomElement(['payment', 'fee', 'adjustment', 'interest']),
      });
      break;
  }

  return {
    event: eventType,
    userId,
    timestamp,
    properties: baseProperties,
    messageId: randomUUID(),
  };
}

// ============ SEGMENT DEFINITIONS ============

interface SegmentTemplate {
  name: string;
  description: string;
  definition: object;
}

function generateSegmentTemplates(): SegmentTemplate[] {
  const templates: SegmentTemplate[] = [];
  
  // Balance-based segments
  const balanceRanges = [
    { name: 'Very Low Balance', min: 0, max: 500 },
    { name: 'Low Balance', min: 500, max: 2000 },
    { name: 'Medium Balance', min: 2000, max: 10000 },
    { name: 'High Balance', min: 10000, max: 25000 },
    { name: 'Very High Balance', min: 25000, max: 100000 },
  ];
  
  for (const range of balanceRanges) {
    templates.push({
      name: `${range.name} Users`,
      description: `Users with balance between $${range.min} and $${range.max}`,
      definition: {
        entryNode: {
          type: 'Trait',
          id: randomUUID(),
          path: 'account_currentBalance',
          operator: {
            type: 'GreaterThanOrEqual',
            value: range.min,
          },
        },
        nodes: [],
      },
    });
  }
  
  // Status-based segments
  for (const status of DEBT_STATUS_CODES) {
    templates.push({
      name: `${status} Status Accounts`,
      description: `Accounts with ${status} debt status`,
      definition: {
        entryNode: {
          type: 'Trait',
          id: randomUUID(),
          path: 'account_debtStatusCodeGroup',
          operator: {
            type: 'Equals',
            value: status,
          },
        },
        nodes: [],
      },
    });
  }
  
  // State-based segments
  for (const state of US_STATES.slice(0, 10)) {
    templates.push({
      name: `${state} Users`,
      description: `Users located in ${state}`,
      definition: {
        entryNode: {
          type: 'Trait',
          id: randomUUID(),
          path: 'account_state',
          operator: {
            type: 'Equals',
            value: state,
          },
        },
        nodes: [],
      },
    });
  }
  
  // Active/Inactive segments
  templates.push({
    name: 'Active Accounts',
    description: 'Users with active accounts',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_active',
        operator: {
          type: 'Equals',
          value: 'true',
        },
      },
      nodes: [],
    },
  });
  
  templates.push({
    name: 'Inactive Accounts',
    description: 'Users with inactive accounts',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_active',
        operator: {
          type: 'Equals',
          value: 'false',
        },
      },
      nodes: [],
    },
  });
  
  // Event-based segments
  for (const event of ['PAYMENT_MADE', 'EMAIL_OPENED', 'EMAIL_CLICKED', 'LOGIN', 'INBOUND_CALL_CONNECTED']) {
    templates.push({
      name: `${event.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Users`,
      description: `Users who have performed ${event}`,
      definition: {
        entryNode: {
          type: 'Performed',
          id: randomUUID(),
          event: event,
          times: 1,
          timesOperator: 'GreaterThanOrEqual',
        },
        nodes: [],
      },
    });
  }
  
  // Verified users
  templates.push({
    name: 'Verified Users',
    description: 'Users who have verified their identity',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_isVerified',
        operator: {
          type: 'Equals',
          value: 'true',
        },
      },
      nodes: [],
    },
  });
  
  // Do Not Contact segments
  templates.push({
    name: 'Do Not Email',
    description: 'Users who opted out of email',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_doNotEmail',
        operator: {
          type: 'Equals',
          value: 'true',
        },
      },
      nodes: [],
    },
  });
  
  templates.push({
    name: 'Do Not SMS',
    description: 'Users who opted out of SMS',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_doNotTxt',
        operator: {
          type: 'Equals',
          value: 'true',
        },
      },
      nodes: [],
    },
  });
  
  // Legal status
  templates.push({
    name: 'In Legal Process',
    description: 'Accounts currently in legal proceedings',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_inLegal',
        operator: {
          type: 'Equals',
          value: 'true',
        },
      },
      nodes: [],
    },
  });
  
  // Everyone segment
  templates.push({
    name: 'Everyone',
    description: 'All users in the system',
    definition: {
      entryNode: {
        type: 'Everyone',
        id: randomUUID(),
      },
      nodes: [],
    },
  });
  
  // Multiple phone numbers
  templates.push({
    name: 'Multiple Phone Numbers',
    description: 'Users with more than 2 phone numbers',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_activePhoneNumbers',
        operator: {
          type: 'GreaterThanOrEqual',
          value: 3,
        },
      },
      nodes: [],
    },
  });
  
  // High engagement (multiple events)
  templates.push({
    name: 'High Engagement',
    description: 'Users who have logged in multiple times',
    definition: {
      entryNode: {
        type: 'Performed',
        id: randomUUID(),
        event: 'LOGIN',
        times: 5,
        timesOperator: 'GreaterThanOrEqual',
      },
      nodes: [],
    },
  });
  
  // Payment makers
  templates.push({
    name: 'Recent Payment Makers',
    description: 'Users who have made a payment recently',
    definition: {
      entryNode: {
        type: 'Performed',
        id: randomUUID(),
        event: 'PAYMENT_MADE',
        times: 1,
        timesOperator: 'GreaterThanOrEqual',
        withinSeconds: 30 * 24 * 60 * 60, // 30 days
      },
      nodes: [],
    },
  });
  
  // Disputed accounts
  templates.push({
    name: 'Disputed Accounts',
    description: 'Accounts with active disputes',
    definition: {
      entryNode: {
        type: 'Trait',
        id: randomUUID(),
        path: 'account_disputed',
        operator: {
          type: 'Equals',
          value: 'true',
        },
      },
      nodes: [],
    },
  });
  
  return templates;
}

// ============ JOURNEY DEFINITIONS ============

interface JourneyTemplate {
  name: string;
  segmentName: string;
}

function generateJourneyTemplates(): JourneyTemplate[] {
  return [
    { name: 'Welcome New Users', segmentName: 'NEW Status Accounts' },
    { name: 'Payment Reminder', segmentName: 'ACTIVE Status Accounts' },
    { name: 'Re-engagement Campaign', segmentName: 'Inactive Accounts' },
    { name: 'High Balance Outreach', segmentName: 'Very High Balance Users' },
    { name: 'Payment Confirmation', segmentName: 'Recent Payment Makers' },
    { name: 'Dispute Resolution', segmentName: 'Disputed Accounts' },
    { name: 'Legal Notice Flow', segmentName: 'In Legal Process' },
    { name: 'Email Engagement Boost', segmentName: 'Email Opened Users' },
    { name: 'Call Follow-up', segmentName: 'Inbound Call Connected Users' },
    { name: 'Verification Reminder', segmentName: 'Active Accounts' },
    { name: 'California Outreach', segmentName: 'CA Users' },
    { name: 'Texas Campaign', segmentName: 'TX Users' },
    { name: 'New York Outreach', segmentName: 'NY Users' },
    { name: 'Low Balance Assistance', segmentName: 'Low Balance Users' },
    { name: 'Medium Balance Engagement', segmentName: 'Medium Balance Users' },
    { name: 'SMS Opt-in Campaign', segmentName: 'Do Not SMS' },
    { name: 'Email Opt-in Campaign', segmentName: 'Do Not Email' },
    { name: 'Multi-channel Engagement', segmentName: 'High Engagement' },
    { name: 'Pending Status Follow-up', segmentName: 'PENDING Status Accounts' },
    { name: 'Closed Account Feedback', segmentName: 'CLOSED Status Accounts' },
  ];
}

// ============ API CALLS ============

async function callIdentifyAPI(payload: object): Promise<boolean> {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/public/apps/identify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CONFIG.WRITE_KEY,
      },
      body: JSON.stringify(payload),
    });
    return response.status === 204;
  } catch (error) {
    console.error('Identify API error:', error);
    return false;
  }
}

async function callTrackAPI(payload: object): Promise<boolean> {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/public/apps/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CONFIG.WRITE_KEY,
      },
      body: JSON.stringify(payload),
    });
    return response.status === 204;
  } catch (error) {
    console.error('Track API error:', error);
    return false;
  }
}

async function callBatchAPI(batch: object[]): Promise<boolean> {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/public/apps/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CONFIG.WRITE_KEY,
      },
      body: JSON.stringify({ batch }),
    });
    return response.status === 204;
  } catch (error) {
    console.error('Batch API error:', error);
    return false;
  }
}

// ============ MAIN EXECUTION ============

async function createUsers(): Promise<UserData[]> {
  console.log(`\n📝 Creating ${CONFIG.NUM_USERS} users...`);
  const users: UserData[] = [];
  const batchItems: object[] = [];
  
  for (let i = 0; i < CONFIG.NUM_USERS; i++) {
    const user = generateUser(i);
    users.push(user);
    
    const identifyPayload = createIdentifyPayload(user);
    batchItems.push({
      type: 'identify',
      ...identifyPayload,
    });
    
    // Send batch when full
    if (batchItems.length >= CONFIG.BATCH_SIZE) {
      const success = await callBatchAPI(batchItems);
      if (success) {
        process.stdout.write(`\r  Created ${i + 1}/${CONFIG.NUM_USERS} users`);
      } else {
        console.error(`\n  Failed at batch ending at user ${i + 1}`);
      }
      batchItems.length = 0;
      
      // Small delay to not overwhelm the server
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  // Send remaining items
  if (batchItems.length > 0) {
    await callBatchAPI(batchItems);
  }
  
  console.log(`\n✅ Created ${users.length} users`);
  return users;
}

async function createEvents(users: UserData[]): Promise<void> {
  console.log(`\n📊 Creating ${CONFIG.NUM_EVENTS} events...`);
  const batchItems: object[] = [];
  
  for (let i = 0; i < CONFIG.NUM_EVENTS; i++) {
    const user = randomElement(users);
    const eventType = randomElement(EVENT_TYPES);
    const timestamp = randomDate(60); // Events from last 60 days
    
    const trackPayload = createTrackPayload(user.userId, eventType, timestamp);
    batchItems.push({
      type: 'track',
      ...trackPayload,
    });
    
    if (batchItems.length >= CONFIG.BATCH_SIZE) {
      const success = await callBatchAPI(batchItems);
      if (success) {
        process.stdout.write(`\r  Created ${i + 1}/${CONFIG.NUM_EVENTS} events`);
      } else {
        console.error(`\n  Failed at batch ending at event ${i + 1}`);
      }
      batchItems.length = 0;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  if (batchItems.length > 0) {
    await callBatchAPI(batchItems);
  }
  
  console.log(`\n✅ Created ${CONFIG.NUM_EVENTS} events`);
}

async function main() {
  console.log('🚀 Starting Dittofeed Data Seeder');
  console.log('================================');
  console.log(`API Base URL: ${CONFIG.API_BASE_URL}`);
  console.log(`Workspace ID: ${CONFIG.WORKSPACE_ID}`);
  console.log(`Target: ${CONFIG.NUM_USERS} users, ${CONFIG.NUM_EVENTS} events`);
  console.log(`        ${CONFIG.NUM_SEGMENTS} segments, ${CONFIG.NUM_JOURNEYS} journeys`);
  console.log('');
  
  // Step 1: Create users
  const users = await createUsers();
  
  // Step 2: Create events
  await createEvents(users);
  
  // Step 3 & 4: Segments and Journeys will be created via SQL
  console.log('\n📋 Segment and Journey templates generated.');
  console.log('   Run the SQL script to insert them into the database.');
  
  // Generate SQL for segments and journeys
  const segmentTemplates = generateSegmentTemplates();
  const journeyTemplates = generateJourneyTemplates();
  
  console.log(`\n✨ Generated ${segmentTemplates.length} segment templates`);
  console.log(`✨ Generated ${journeyTemplates.length} journey templates`);
  
  console.log('\n✅ Seeding complete!');
}

// Export for programmatic use
export {
  CONFIG,
  generateUser,
  createIdentifyPayload,
  createTrackPayload,
  generateSegmentTemplates,
  generateJourneyTemplates,
  callIdentifyAPI,
  callTrackAPI,
  callBatchAPI,
};

// Run if executed directly
main().catch(console.error);

