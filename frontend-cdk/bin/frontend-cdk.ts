#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontendCdkStack } from '../lib/frontend-cdk-stack';

const app = new cdk.App();
new FrontendCdkStack(app, 'FrontendCdkStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || 'YOUR_AWS_ACCOUNT_ID',
    region: process.env.CDK_DEFAULT_REGION || 'YOUR_AWS_REGION' // e.g., 'us-east-1'
  }
});
