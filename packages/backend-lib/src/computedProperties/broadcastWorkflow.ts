import { proxyActivities } from "@temporalio/workflow";

// Only import the activity types
import type * as activities from "../temporal/activities";
import config from "../config";

const {
  broadcastWorkflowStartToCloseTimeout
} = config();

const { performBroadcastIncremental } = proxyActivities<typeof activities>({
  startToCloseTimeout: broadcastWorkflowStartToCloseTimeout,
});

export function generateBroadcastWorkflowId({
  workspaceId,
  broadcastId,
}: {
  workspaceId: string;
  broadcastId: string;
}) {
  return `broadcast-workflow-${workspaceId}-${broadcastId}`;
}

export interface BroadcastWorkflowParams {
  workspaceId: string;
  broadcastId: string;
}

export async function broadcastWorkflow({
  workspaceId,
  broadcastId,
}: BroadcastWorkflowParams): Promise<void> {
  await performBroadcastIncremental({ workspaceId, broadcastId });
}
