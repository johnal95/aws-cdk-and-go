import * as ec2 from "aws-cdk-lib/aws-ec2";
import type { IConstruct } from "constructs";

export function createVPC(scope: IConstruct): ec2.Vpc {
    const vpc = new ec2.Vpc(scope, "VPC", {
        maxAzs: 3,
        ipAddresses: ec2.IpAddresses.cidr("172.31.0.0/16"),
        natGateways: 0,
        createInternetGateway: true,
        subnetConfiguration: [
            {
                name: "public",
                cidrMask: 20,
                subnetType: ec2.SubnetType.PUBLIC,
            },
            {
                name: "private",
                cidrMask: 20,
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        ],
    });

    return vpc;
}
