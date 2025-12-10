import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/public/apps';
const WRITE_KEY = 'NjA4NmExZDMtMTEzOC00YTUwLTg3ZDgtNmI3NzIxZTI2M2U4OjVlNTZjMTk1LWI3YzMtNDBlNS04MjIyLWU3ODVhMTdlNzY1NA==';

// Journey IDs
const JOURNEYS = [
  { id: 'e49acd5a-f91d-48da-95ac-32d0ef9c9eeb', name: 'Payment Confirmation', nodeId: 'message-1' },
  { id: '8cefb390-bf71-4755-8ecb-352fcbb7650a', name: 'Welcome New Users', nodeId: 'message-1' },
  { id: '4ceef338-844d-4b43-97d9-076aa6c977e7', name: 'Payment Reminder Flow', nodeId: 'message-1' },
  { id: 'af4bf4b9-3982-4b85-805b-9c4b9ac66379', name: 'High Balance Outreach', nodeId: 'message-1' },
  { id: '3f83f40f-08fb-4abe-b0cb-8327057f2c4b', name: 'Re-engagement Campaign', nodeId: 'message-1' },
];

// Template IDs
const TEMPLATE_ID = '5ede65b6-d433-5d50-9089-4ad0141dd01c';

// Event types with journey context
const JOURNEY_EVENTS = [
  'DFEmailSent',
  'DFEmailDelivered',
  'DFEmailOpened',
  'DFEmailClicked',
  'DFEmailBounced',
  'DFEmailDropped',
];

async function trackEvent(userId: string, event: string, properties: Record<string, any>) {
  const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
  
  try {
    await axios.post(`${API_BASE}/track`, {
      userId,
      event,
      timestamp,
      properties,
      messageId: crypto.randomUUID(),
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${WRITE_KEY}`,
      },
    });
    return true;
  } catch (error) {
    console.error(`Failed to track ${event} for ${userId}`);
    return false;
  }
}

async function main() {
  console.log('Creating events with Related Resources...\n');
  
  let successCount = 0;
  let totalEvents = 0;
  
  // Generate 500 events with journey/template context
  for (let i = 0; i < 500; i++) {
    const userId = String(1000 + Math.floor(Math.random() * 2000));
    const journey = JOURNEYS[Math.floor(Math.random() * JOURNEYS.length)];
    const eventType = JOURNEY_EVENTS[Math.floor(Math.random() * JOURNEY_EVENTS.length)];
    
    const properties: Record<string, any> = {
      journeyId: journey.id,
      nodeId: journey.nodeId,
      templateId: TEMPLATE_ID,
      email: `user${userId}@example.com`,
      subject: `Message from ${journey.name}`,
    };
    
    // Add event-specific properties
    if (eventType === 'DFEmailClicked') {
      properties.link = 'https://example.com/payment';
    }
    if (eventType === 'DFEmailBounced') {
      properties.bounceType = Math.random() > 0.5 ? 'hard' : 'soft';
    }
    
    const success = await trackEvent(userId, eventType, properties);
    if (success) successCount++;
    totalEvents++;
    
    if (totalEvents % 50 === 0) {
      console.log(`Progress: ${totalEvents}/500 events (${successCount} successful)`);
    }
  }
  
  console.log(`\n✅ Created ${successCount}/${totalEvents} events with Related Resources`);
}

main().catch(console.error);

