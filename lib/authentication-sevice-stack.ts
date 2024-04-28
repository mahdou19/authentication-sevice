import { CfnOutput, Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { IAuthenticationSeviceStackProps } from "../bin/authentication-sevice";

import { CorsHttpMethod, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class AuthenticationSeviceStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: IAuthenticationSeviceStackProps
  ) {
    super(scope, id, props);

    const { currentBranch } = props;
    const stackName = `AuthenticationSeviceStack-${currentBranch}`;
    const rootFunctionPath = "./lambda/functions";

    //configure apigateway
    const httpApi = new HttpApi(this, `HttpApi-${currentBranch}`, {
      description: "AuthenticationSeviceStack-api",
      corsPreflight: {
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.HEAD,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST,
        ],
      },
    });

    // //configure Hello word lambda
    const helloWorldFn = new NodejsFunction(
      this,
      `helloWorldFn-${currentBranch}`,
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: `${rootFunctionPath}/hello-world/hello-world.ts`,
        handler: "helloLambda",
      }
    );
    const helloIntegration = new HttpLambdaIntegration(
      `${stackName}-helloWorldFn-${currentBranch}`,
      helloWorldFn
    );

    // //configure endpoint
    httpApi.addRoutes({
      path: "/hello-world",
      methods: [HttpMethod.GET],
      integration: helloIntegration,
    });

    // Stack Outputs
    new CfnOutput(this, "HttpiEndpoint", {
      value: httpApi.apiEndpoint,
    });
  }
}
