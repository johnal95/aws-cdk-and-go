import * as ec2 from "aws-cdk-lib/aws-ec2";
import type { IConstruct } from "constructs";

export function createSecurityGroups(scope: IConstruct, vpc: ec2.IVpc) {
    const server = new ec2.SecurityGroup(scope, "ServerSG", {
        vpc,
        allowAllOutbound: true,
    });

    const database = new ec2.SecurityGroup(scope, "DatabaseSG", {
        vpc,
        allowAllOutbound: true,
    });

    database.addIngressRule(server, ec2.Port.tcp(5432), "allow postgres connection from server");

    return {
        server,
        database,
    };
}
