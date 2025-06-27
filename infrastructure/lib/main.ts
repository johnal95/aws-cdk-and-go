import * as cdk from "aws-cdk-lib";

import { InfrastructureStack } from "./infrastructure-stack.ts";
import { config } from "./config.ts";

const app = new cdk.App();

new InfrastructureStack(app, "InfrastructureStack", {
    env: {
        account: config.aws.account,
        region: config.aws.region,
    },
});
