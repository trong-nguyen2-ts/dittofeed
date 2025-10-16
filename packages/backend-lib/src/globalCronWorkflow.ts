import { proxyActivities } from "@temporalio/workflow";

import type * as activities from "./temporal/activities";
import config from "./config";

const {
  globalCronWorkflowStartToCloseTimeout
} = config();

const { emitGlobalSignals } = proxyActivities<typeof activities>({
  startToCloseTimeout: globalCronWorkflowStartToCloseTimeout,
});

export const GLOBAL_CRON_ID = "global-cron-workflow";

export async function globalCronWorkflow() {
  await emitGlobalSignals();
}
