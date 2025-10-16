import { proxyActivities } from "@temporalio/workflow";

// Only import the activity types
import type * as activities from "./temporal/activities";
import config from "./config";

export interface RestartUserJourneyWorkflowProps {
  workspaceId: string;
  journeyId: string;
  statusUpdatedAt: number;
}

export function generateRestartUserJourneysWorkflowId({
  workspaceId,
  journeyId,
}: RestartUserJourneyWorkflowProps) {
  return `restart-user-journeys-workflow-${workspaceId}-${journeyId}`;
}

const {
  restartUserJourneysWorkflowStartToCloseTimeout
} = config();

const { restartUserJourneysActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: restartUserJourneysWorkflowStartToCloseTimeout,
});

export async function restartUserJourneysWorkflow({
  workspaceId,
  journeyId,
  statusUpdatedAt,
}: RestartUserJourneyWorkflowProps) {
  await restartUserJourneysActivity({
    workspaceId,
    journeyId,
    statusUpdatedAt,
  });
}
