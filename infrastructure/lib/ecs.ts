import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsp from "aws-cdk-lib/aws-ecs-patterns";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import type { IConstruct } from "constructs";

import { config } from "./config.ts";

export function createECSCluster(scope: IConstruct, vpc: ec2.IVpc) {
    const cluster = new ecs.Cluster(scope, "ECSCluster", {
        vpc,
        enableFargateCapacityProviders: true,
        containerInsightsV2: ecs.ContainerInsights.DISABLED,
    });
    return cluster;
}

export function createECSService(
    scope: IConstruct,
    cluster: ecs.ICluster,
    sg: ec2.ISecurityGroup,
    env: { [name: string]: string },
) {
    const taskDefinition = new ecs.FargateTaskDefinition(scope, "ServerTaskDefinition", {
        runtimePlatform: {
            operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
            cpuArchitecture: ecs.CpuArchitecture.ARM64,
        },
        memoryLimitMiB: 512, // 0.5 GiB
        cpu: 256, // 0.25 vCPU
    });

    const dockerImageAsset = new ecra.DockerImageAsset(scope, "ServerImageAsset", {
        directory: config.paths.root,
        platform: ecra.Platform.LINUX_ARM64,
    });

    taskDefinition.addContainer("ServerContainer", {
        image: ecs.ContainerImage.fromDockerImageAsset(dockerImageAsset),
        essential: true,
        portMappings: [
            {
                name: "server-8080-tpc",
                hostPort: 8080,
                containerPort: 8080,
                protocol: ecs.Protocol.TCP,
                appProtocol: ecs.AppProtocol.http,
            },
        ],
        logging: ecs.LogDriver.awsLogs({ streamPrefix: "ecs" }),
        environment: env,
        secrets: {},
    });

    const ecsService = new ecsp.ApplicationLoadBalancedFargateService(scope, "ServerECSService", {
        cluster,
        capacityProviderStrategies: [{ capacityProvider: "FARGATE_SPOT", weight: 1 }],
        securityGroups: [sg],
        taskDefinition,
        desiredCount: 1,
        assignPublicIp: true,
        publicLoadBalancer: true, // required for CloudFront access, can be restricted to CloudFront origins
    });

    const ecsServiceAutoScaling = ecsService.service.autoScaleTaskCount({
        minCapacity: 1,
        maxCapacity: 2,
    });

    ecsServiceAutoScaling.scaleOnRequestCount("ServerECSServiceAutoScaling", {
        targetGroup: ecsService.targetGroup,
        requestsPerTarget: 1200,
        scaleInCooldown: cdk.Duration.minutes(5),
        scaleOutCooldown: cdk.Duration.minutes(1),
    });

    ecsService.targetGroup.configureHealthCheck({
        path: "/health-check",
    });

    return ecsService;
}
