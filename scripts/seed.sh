#!/bin/bash
# =============================================================================
# DITTOFEED SEED ALL DATA SCRIPT
# Tạo toàn bộ data test: users, events, segments, journeys
# Usage: ./scripts/seed-all.sh [--clean]
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   DITTOFEED DATA SEEDING SCRIPT${NC}"
echo -e "${BLUE}============================================${NC}"

# Get workspace info
WORKSPACE_ID="6086a1d3-1138-4a50-87d8-6b7721e263e8"
WRITE_KEY="Basic M2M3NmQxZTgtMjBmNy00OWI2LTg5NzUtZTNhMmE5MmJiZmExOmIyNDExZWMyM2Y0NDY3NWY="

# Check if --clean flag is passed
if [[ "$1" == "--clean" ]]; then
    echo -e "\n${YELLOW}🧹 Cleaning existing data...${NC}"
    
    # Clear ClickHouse
    CLICKHOUSE_CONTAINER=$(docker ps --filter "name=clickhouse" -q)
    if [ -n "$CLICKHOUSE_CONTAINER" ]; then
        docker exec -i $CLICKHOUSE_CONTAINER clickhouse-client --query "TRUNCATE TABLE dittofeed.user_events_v2;" 2>/dev/null || true
        docker exec -i $CLICKHOUSE_CONTAINER clickhouse-client --query "TRUNCATE TABLE dittofeed.computed_property_state_v3;" 2>/dev/null || true
        echo -e "${GREEN}  ✓ ClickHouse cleared${NC}"
    fi
    
    # Clear PostgreSQL segments/journeys
    POSTGRES_CONTAINER=$(docker ps --filter "name=postgres" -q)
    if [ -n "$POSTGRES_CONTAINER" ]; then
        docker exec -i $POSTGRES_CONTAINER psql -U postgres -d dittofeed -c "DELETE FROM \"Segment\" WHERE \"workspaceId\" = '$WORKSPACE_ID' AND name NOT LIKE 'subscriptionGroup%';" 2>/dev/null || true
        docker exec -i $POSTGRES_CONTAINER psql -U postgres -d dittofeed -c "DELETE FROM \"Journey\" WHERE \"workspaceId\" = '$WORKSPACE_ID';" 2>/dev/null || true
        echo -e "${GREEN}  ✓ PostgreSQL cleared${NC}"
    fi
fi

# Step 1: Create Segments & Journeys
echo -e "\n${YELLOW}📦 Step 1: Creating Segments & Journeys...${NC}"

POSTGRES_CONTAINER=$(docker ps --filter "name=postgres" -q)
docker exec -i $POSTGRES_CONTAINER psql -U postgres -d dittofeed << 'EOSQL'
-- Create message template
INSERT INTO "MessageTemplate" (id, "workspaceId", name, definition, "createdAt", "updatedAt")
VALUES ('5ede65b6-d433-5d50-9089-4ad0141dd01c', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Welcome Email', 
'{"type":"Email","subject":"Welcome!","from":"noreply@example.com","body":"<p>Welcome!</p>"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create segments
INSERT INTO "Segment" (id, "workspaceId", name, definition, "createdAt", "updatedAt", status) VALUES
('e984d44b-5aca-46d5-976e-c5fee8112aac', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Everyone', '{"entryNode":{"type":"Everyone","id":"1"},"nodes":[]}', NOW(), NOW(), 'Running'),
('566961dd-be39-44d3-a2bb-a986fd5e836f', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'NEW Status', '{"entryNode":{"type":"Trait","id":"1","path":"account_debtStatusCodeGroup","operator":{"type":"Equals","value":"NEW"}},"nodes":[]}', NOW(), NOW(), 'Running'),
('bcc4364e-d254-4d45-956a-5cfd9949a9fa', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'ACTIVE Status', '{"entryNode":{"type":"Trait","id":"1","path":"account_debtStatusCodeGroup","operator":{"type":"Equals","value":"ACTIVE"}},"nodes":[]}', NOW(), NOW(), 'Running'),
('4f2783da-9923-4a8f-a324-bd7c7aca6c16', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'PENDING Status', '{"entryNode":{"type":"Trait","id":"1","path":"account_debtStatusCodeGroup","operator":{"type":"Equals","value":"PENDING"}},"nodes":[]}', NOW(), NOW(), 'Running'),
('847d89ad-42ac-461a-ad2d-673360931224', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'CLOSED Status', '{"entryNode":{"type":"Trait","id":"1","path":"account_debtStatusCodeGroup","operator":{"type":"Equals","value":"CLOSED"}},"nodes":[]}', NOW(), NOW(), 'Running'),
('6e15a862-a177-4d0e-8b5f-cb261e76b439', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Active Accounts', '{"entryNode":{"type":"Trait","id":"1","path":"account_active","operator":{"type":"Equals","value":"true"}},"nodes":[]}', NOW(), NOW(), 'Running'),
('383b6ae0-0326-4754-9679-bafc33d0e0f5', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Inactive Accounts', '{"entryNode":{"type":"Trait","id":"1","path":"account_active","operator":{"type":"Equals","value":"false"}},"nodes":[]}', NOW(), NOW(), 'Running'),
('ea59b439-938f-4002-ab35-9e829c0d5f2c', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Verified Users', '{"entryNode":{"type":"Trait","id":"1","path":"account_isVerified","operator":{"type":"Equals","value":"true"}},"nodes":[]}', NOW(), NOW(), 'Running'),
('ef5d285f-5d21-467e-a9b6-4601e1aabdd9', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Inbound Callers', '{"entryNode":{"type":"Performed","id":"1","event":"INBOUND_CALL_CONNECTED","times":1,"timesOperator":">="},"nodes":[]}', NOW(), NOW(), 'Running'),
('a655ecd6-c067-4b5a-bb8c-dbc320d19826', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Payment Makers', '{"entryNode":{"type":"Performed","id":"1","event":"PAYMENT_MADE","times":1,"timesOperator":">="},"nodes":[]}', NOW(), NOW(), 'Running'),
('4442b785-2335-4ae3-884f-da78784c3c61', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Email Openers', '{"entryNode":{"type":"Performed","id":"1","event":"EMAIL_OPENED","times":1,"timesOperator":">="},"nodes":[]}', NOW(), NOW(), 'Running'),
('f6a7b8c9-d0e1-2345-f012-456789012345', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Dispute Filers', '{"entryNode":{"type":"Performed","id":"1","event":"DISPUTE_FILED","times":1,"timesOperator":">="},"nodes":[]}', NOW(), NOW(), 'Running')
ON CONFLICT (id) DO NOTHING;

-- Create journeys
INSERT INTO "Journey" (id, "workspaceId", name, status, definition, "createdAt", "updatedAt") VALUES
('8cefb390-bf71-4755-8ecb-352fcbb7650a', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Welcome New Users', 'NotStarted',
'{"entryNode":{"type":"EntryNode","segment":"566961dd-be39-44d3-a2bb-a986fd5e836f","child":"delay-1"},"nodes":[{"id":"delay-1","type":"DelayNode","variant":{"type":"Second","seconds":86400},"child":"msg-1"},{"id":"msg-1","type":"MessageNode","name":"Welcome","variant":{"type":"Email","templateId":"5ede65b6-d433-5d50-9089-4ad0141dd01c"},"child":"ExitNode"}],"exitNode":{"type":"ExitNode"}}', NOW(), NOW()),
('4ceef338-844d-4b43-97d9-076aa6c977e7', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Payment Reminder', 'NotStarted',
'{"entryNode":{"type":"EntryNode","segment":"6e15a862-a177-4d0e-8b5f-cb261e76b439","child":"delay-1"},"nodes":[{"id":"delay-1","type":"DelayNode","variant":{"type":"Second","seconds":259200},"child":"msg-1"},{"id":"msg-1","type":"MessageNode","name":"Reminder","variant":{"type":"Email","templateId":"5ede65b6-d433-5d50-9089-4ad0141dd01c"},"child":"ExitNode"}],"exitNode":{"type":"ExitNode"}}', NOW(), NOW()),
('e49acd5a-f91d-48da-95ac-32d0ef9c9eeb', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Payment Confirmation', 'NotStarted',
'{"entryNode":{"type":"EventEntryNode","event":"PAYMENT_MADE","child":"msg-1"},"nodes":[{"id":"msg-1","type":"MessageNode","name":"Thank You","variant":{"type":"Email","templateId":"5ede65b6-d433-5d50-9089-4ad0141dd01c"},"child":"ExitNode"}],"exitNode":{"type":"ExitNode"}}', NOW(), NOW()),
('d4e5f6a7-4444-5555-6666-777788889999', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Call Follow-up', 'NotStarted',
'{"entryNode":{"type":"EventEntryNode","event":"INBOUND_CALL_CONNECTED","child":"delay-1"},"nodes":[{"id":"delay-1","type":"DelayNode","variant":{"type":"Second","seconds":7200},"child":"msg-1"},{"id":"msg-1","type":"MessageNode","name":"Call Summary","variant":{"type":"Email","templateId":"5ede65b6-d433-5d50-9089-4ad0141dd01c"},"child":"ExitNode"}],"exitNode":{"type":"ExitNode"}}', NOW(), NOW()),
('3f83f40f-08fb-4abe-b0cb-8327057f2c4b', '6086a1d3-1138-4a50-87d8-6b7721e263e8', 'Re-engagement', 'NotStarted',
'{"entryNode":{"type":"EntryNode","segment":"383b6ae0-0326-4754-9679-bafc33d0e0f5","child":"msg-1"},"nodes":[{"id":"msg-1","type":"MessageNode","name":"We Miss You","variant":{"type":"Email","templateId":"5ede65b6-d433-5d50-9089-4ad0141dd01c"},"child":"ExitNode"}],"exitNode":{"type":"ExitNode"}}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
EOSQL

echo -e "${GREEN}  ✓ Created 12 segments and 5 journeys${NC}"

# Step 2: Create Users & Events
echo -e "\n${YELLOW}📝 Step 2: Creating Users & Events (this may take a few minutes)...${NC}"
cd "$PROJECT_DIR"
npx tsx scripts/seed.ts

echo -e "\n${BLUE}============================================${NC}"
echo -e "${GREEN}✅ ALL DONE!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "Created:"
echo -e "  • 2000 users (identify events)"
echo -e "  • 2000 ACCOUNT_CREATED_FROM_WORKSHEET events"
echo -e "  • 1500 INBOUND_CALL_CONNECTED events"
echo -e "  • 2500 other events"
echo -e "  • 12 segments"
echo -e "  • 5 journeys"
echo -e "\nView at: ${BLUE}http://localhost:3000/dashboard/users${NC}"

