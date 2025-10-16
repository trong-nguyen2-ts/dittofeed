import { proxyActivities } from "@temporalio/workflow";

import * as activities from "./bootstrap/activities";
import { default as configEnv } from "../config";

const { bootstrapStartToCloseTimeout } = configEnv();

const { bootstrap } = proxyActivities<typeof activities>({
  startToCloseTimeout: bootstrapStartToCloseTimeout,
});

export async function bootstrapWorkflow(
  params: Parameters<typeof bootstrap>[0],
) {
  await bootstrap(params);
}
