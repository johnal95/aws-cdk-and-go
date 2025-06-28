import * as cdk from "aws-cdk-lib";

import { AppStage } from "./app-stage.ts";
import { config } from "./config.ts";

const app = new cdk.App();

new AppStage(app, "Dev", {
    env: {
        account: config.aws.account,
        region: config.aws.region,
    },
});

new AppStage(app, "Prod", {
    env: {
        account: config.aws.account,
        region: config.aws.region,
    },
});
