import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontorigins from "aws-cdk-lib/aws-cloudfront-origins";
import type { ILoadBalancerV2 } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import type { IConstruct } from "constructs";

export function createCloudFrontDistribution(scope: IConstruct, lb: ILoadBalancerV2): cloudfront.Distribution {
    const distribution = new cloudfront.Distribution(scope, "CloudFrontDistribution", {
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        geoRestriction: cloudfront.GeoRestriction.allowlist("GB"),
        defaultBehavior: {
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
            origin: new cloudfrontorigins.LoadBalancerV2Origin(lb, {
                protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            }),
            cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
    });

    return distribution;
}
