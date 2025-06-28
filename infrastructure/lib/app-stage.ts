import * as cdk from "aws-cdk-lib";
import type { IConstruct } from "constructs";

import { InfrastructureStack } from "./infrastructure-stack.ts";

export class AppStage extends cdk.Stage {
    constructor(scope: IConstruct, id: "Dev" | "Prod", props?: cdk.StageProps) {
        super(scope, id, props);

        new InfrastructureStack(this, "InfrastructureStack", { tags: { stage: id } });
    }
}
