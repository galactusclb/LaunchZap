import AWSXRay from "aws-xray-sdk";
import { ErrorRequestHandler, RequestHandler } from "express";

import { constants } from "@/utils/constant";

const ENABLED = constants.aws.xray.enabled === "true";
const SERVICE_NAME = constants.aws.xray.serviceName

export function configureXray(){
    console.log('xray is ENABLED?', ENABLED, SERVICE_NAME)
    if (!ENABLED) return;

    AWSXRay.config([AWSXRay.plugins.ECSPlugin]);
    AWSXRay.setContextMissingStrategy("LOG_ERROR");
}

const noop: RequestHandler = (_req, _res, next) => next();
const noopError: ErrorRequestHandler = (_err, _req, _res, next) => next();

export const xrayOpen: RequestHandler = ENABLED ? AWSXRay.express.openSegment(SERVICE_NAME) : noop;
export const xrayClose: ErrorRequestHandler = ENABLED ? AWSXRay.express.closeSegment(): noopError;