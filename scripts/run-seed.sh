#!/bin/bash

# Dittofeed Realistic Data Seeder Runner
# Chạy tất cả các bước để seed data

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 Dittofeed Data Seeder"
echo "========================"
echo ""

# Step 1: Run SQL to create segments and journeys
echo "📋 Step 1: Creating Segments and Journeys..."
POSTGRES_CONTAINER=$(docker ps --filter "name=postgres" -q)

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "❌ Error: PostgreSQL container not running"
    exit 1
fi

docker exec -i "$POSTGRES_CONTAINER" psql -U postgres -d dittofeed < "$SCRIPT_DIR/seed-segments-journeys.sql"

echo ""
echo "✅ Step 1 Complete: Segments and Journeys created"
echo ""

# Step 2: Run TypeScript to create users and events
echo "📝 Step 2: Creating Users and Events..."
echo "(This may take a few minutes...)"
echo ""

cd "$PROJECT_ROOT"

# Check if tsx is available
if command -v npx &> /dev/null; then
    npx tsx "$SCRIPT_DIR/seed-realistic-data.ts"
else
    echo "❌ Error: npx not found. Please run: npm install -g tsx"
    exit 1
fi

echo ""
echo "🎉 All done! Data seeding complete."
echo ""
echo "Summary:"
docker exec -i "$POSTGRES_CONTAINER" psql -U postgres -d dittofeed -c "
SELECT 'Segments' as type, COUNT(*) FROM \"Segment\" WHERE \"workspaceId\" = '6086a1d3-1138-4a50-87d8-6b7721e263e8'
UNION ALL
SELECT 'Journeys', COUNT(*) FROM \"Journey\" WHERE \"workspaceId\" = '6086a1d3-1138-4a50-87d8-6b7721e263e8';
"

CLICKHOUSE_CONTAINER=$(docker ps --filter "name=clickhouse" -q)
if [ -n "$CLICKHOUSE_CONTAINER" ]; then
    echo ""
    echo "Events in ClickHouse:"
    docker exec -i "$CLICKHOUSE_CONTAINER" clickhouse-client --user dittofeed --password password --database dittofeed --query "SELECT count() as events FROM user_events_v2 WHERE workspace_id = '6086a1d3-1138-4a50-87d8-6b7721e263e8'"
fi

