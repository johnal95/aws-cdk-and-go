import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import type { IConstruct } from "constructs";
import { config } from "./config.ts";

export function createDatabaseInstance(scope: IConstruct, vpc: ec2.IVpc, sg: ec2.ISecurityGroup): rds.DatabaseInstance {
    const db = new rds.DatabaseInstance(scope, "PostgresDB", {
        vpc,
        publiclyAccessible: true, // for convenience
        vpcSubnets: {
            subnetType: ec2.SubnetType.PUBLIC, // for convenience
        },
        engine: rds.DatabaseInstanceEngine.postgres({
            version: rds.PostgresEngineVersion.VER_17,
        }),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
        allocatedStorage: 20, // GiB
        maxAllocatedStorage: 100, // GiB
        databaseName: config.database.name,
        credentials: rds.Credentials.fromPassword(
            config.database.username,
            cdk.SecretValue.unsafePlainText(config.database.password), // for convenience
        ),
        securityGroups: [sg],
    });

    return db;
}
