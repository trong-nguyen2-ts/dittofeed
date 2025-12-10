-- Dittofeed Segments & Journeys Seeder
-- Run this after seed-realistic-data.ts to create segments and journeys

-- Variables
\set workspace_id '6086a1d3-1138-4a50-87d8-6b7721e263e8'

-- ============================================================
-- SEGMENTS
-- ============================================================

-- Balance-based segments
INSERT INTO "Segment" (id, "workspaceId", name, definition, "resourceType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'Very Low Balance Users', 
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_currentBalance", "operator": {"type": "LessThan", "value": 500}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Low Balance Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_currentBalance", "operator": {"type": "GreaterThanOrEqual", "value": 500}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Medium Balance Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_currentBalance", "operator": {"type": "GreaterThanOrEqual", "value": 2000}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'High Balance Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_currentBalance", "operator": {"type": "GreaterThanOrEqual", "value": 10000}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Very High Balance Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_currentBalance", "operator": {"type": "GreaterThanOrEqual", "value": 25000}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Status-based segments
INSERT INTO "Segment" (id, "workspaceId", name, definition, "resourceType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'NEW Status Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_debtStatusCodeGroup", "operator": {"type": "Equals", "value": "NEW"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'ACTIVE Status Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_debtStatusCodeGroup", "operator": {"type": "Equals", "value": "ACTIVE"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'PENDING Status Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_debtStatusCodeGroup", "operator": {"type": "Equals", "value": "PENDING"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'LEGAL Status Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_debtStatusCodeGroup", "operator": {"type": "Equals", "value": "LEGAL"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'SETTLED Status Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_debtStatusCodeGroup", "operator": {"type": "Equals", "value": "SETTLED"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'CLOSED Status Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_debtStatusCodeGroup", "operator": {"type": "Equals", "value": "CLOSED"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- State-based segments
INSERT INTO "Segment" (id, "workspaceId", name, definition, "resourceType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'California Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "CA"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Texas Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "TX"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'New York Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "NY"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Florida Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "FL"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Illinois Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "IL"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Pennsylvania Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "PA"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Ohio Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "OH"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Georgia Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "GA"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'North Carolina Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "NC"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Michigan Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_state", "operator": {"type": "Equals", "value": "MI"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Account status segments
INSERT INTO "Segment" (id, "workspaceId", name, definition, "resourceType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'Active Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_active", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Inactive Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_active", "operator": {"type": "Equals", "value": "false"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Verified Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_isVerified", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Unverified Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_isVerified", "operator": {"type": "Equals", "value": "false"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'In Legal Process',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_inLegal", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Disputed Accounts',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_disputed", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Contact preference segments
INSERT INTO "Segment" (id, "workspaceId", name, definition, "resourceType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'Do Not Email',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_doNotEmail", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Do Not SMS',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_doNotTxt", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Email Allowed',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_doNotEmail", "operator": {"type": "Equals", "value": "false"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'SMS Allowed',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_doNotTxt", "operator": {"type": "Equals", "value": "false"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Event-based segments (timesOperator must use enum values: "=", ">=", "<")
INSERT INTO "Segment" (id, "workspaceId", name, definition, "resourceType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'Payment Makers',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "PAYMENT_MADE", "times": 1, "timesOperator": ">="}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Email Openers',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "EMAIL_OPENED", "times": 1, "timesOperator": ">="}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Email Clickers',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "EMAIL_CLICKED", "times": 1, "timesOperator": ">="}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Active Logins',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "LOGIN", "times": 1, "timesOperator": ">="}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Inbound Call Users',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "INBOUND_CALL_CONNECTED", "times": 1, "timesOperator": ">="}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Outbound Call Users',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "OUTBOUND_CALL_CONNECTED", "times": 1, "timesOperator": ">="}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'High Engagement Users',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "LOGIN", "times": 5, "timesOperator": ">="}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Recent Payment Makers',
   '{"entryNode": {"type": "Performed", "id": "node-1", "event": "PAYMENT_MADE", "times": 1, "timesOperator": ">=", "withinSeconds": 2592000}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Special segments  
INSERT INTO "Segment" (id, "workspaceId", name, definition, "resourceType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'Everyone',
   '{"entryNode": {"type": "Everyone", "id": "node-1"}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Multiple Phone Numbers',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_activePhoneNumbers", "operator": {"type": "GreaterThanOrEqual", "value": 3}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Litigious Users',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_demographics_PRIMARY_litigious", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Contact Window Open',
   '{"entryNode": {"type": "Trait", "id": "node-1", "path": "account_demographics_PRIMARY_contactWindowOpen", "operator": {"type": "Equals", "value": "true"}}, "nodes": []}'::jsonb,
   'Declarative', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Show created segments
SELECT 'Segments created:' as info, COUNT(*) as count FROM "Segment" WHERE "workspaceId" = :'workspace_id';

-- ============================================================
-- JOURNEYS
-- ============================================================

-- Create journeys (NotStarted status with basic definition)
-- We need to reference segments by ID, so we'll create simple event-triggered journeys

-- Default journey draft template
\set default_draft '{"nodes": [{"id": "EntryUiNode", "data": {"type": "JourneyUiNodeDefinitionProps", "nodeTypeProps": {"type": "EntryUiNode", "variant": {"type": "EntryNode"}}}}, {"id": "ExitNode", "data": {"type": "JourneyUiNodeDefinitionProps", "nodeTypeProps": {"type": "ExitNode"}}}], "edges": [{"id": "EntryUiNode=>ExitNode", "source": "EntryUiNode", "target": "ExitNode", "type": "workflow", "data": {"type": "JourneyUiDefinitionEdgeProps"}}]}'

INSERT INTO "Journey" (id, "workspaceId", name, status, draft, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), :'workspace_id', 'Welcome New Users', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Payment Reminder Flow', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Re-engagement Campaign', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'High Balance Outreach', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Payment Confirmation', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Dispute Resolution Flow', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Legal Notice Journey', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Email Engagement Boost', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Call Follow-up Sequence', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Verification Reminder', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'California Outreach', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Texas Campaign', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'New York Outreach', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Low Balance Assistance', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Medium Balance Engagement', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'SMS Opt-in Campaign', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Email Opt-in Campaign', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Multi-channel Engagement', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Pending Status Follow-up', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), :'workspace_id', 'Closed Account Feedback', 'NotStarted', :'default_draft'::jsonb, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Show created journeys
SELECT 'Journeys created:' as info, COUNT(*) as count FROM "Journey" WHERE "workspaceId" = :'workspace_id';

-- Summary
SELECT 'SUMMARY' as section;
SELECT 'Total Segments' as type, COUNT(*) as count FROM "Segment" WHERE "workspaceId" = :'workspace_id'
UNION ALL
SELECT 'Total Journeys', COUNT(*) FROM "Journey" WHERE "workspaceId" = :'workspace_id'
UNION ALL
SELECT 'Total Message Templates', COUNT(*) FROM "MessageTemplate" WHERE "workspaceId" = :'workspace_id';

