import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { createVPC } from "./vpc.ts";
import { createSecurityGroups } from "./security-groups.ts";
import { createDatabaseInstance } from "./rds.ts";
import { createECSCluster, createECSService } from "./ecs.ts";
import { createCloudFrontDistribution } from "./cloudfront.ts";
import { config } from "./config.ts";

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = createVPC(this);

        const sg = createSecurityGroups(this, vpc);

        const database = createDatabaseInstance(this, vpc, sg.database);

        const ecsCluster = createECSCluster(this, vpc);

        const ecsService = createECSService(this, ecsCluster, sg.server, {
            DB_NAME: config.database.name,
            DB_HOSTNAME: database.dbInstanceEndpointAddress,
            DB_USERNAME: config.database.username,
            DB_PASSWORD: config.database.password,
            DB_PORT: database.dbInstanceEndpointPort,
        });

        createCloudFrontDistribution(this, ecsService.loadBalancer);
    }
}
