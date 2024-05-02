#!/usr/bin/env node
import "source-map-support/register";
import { StackProps, App } from "aws-cdk-lib";
import { AuthenticationSeviceStack } from "../lib/authentication-sevice-stack";

export interface IAuthenticationSeviceStackProps extends StackProps {
  currentBranch: string;
}

const suffix =
  process.env.GITHUB_REF?.split("/").pop() ||
  `local-${process.env.LOCAL_BRANCH_AUTHOR}`;

const stackProps: IAuthenticationSeviceStackProps = {
  currentBranch: suffix,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
};

const app = new App();
new AuthenticationSeviceStack(
  app,
  `AuthenticationSeviceStack-${suffix}`,
  stackProps
);
