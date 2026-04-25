import {
    GetSecretValueCommand,
    SecretsManagerClient
} from "@aws-sdk/client-secrets-manager";

import { constants } from "@/utils/constants/server";

import { secretManagerResponse, secretManagerResponseSchema } from "./secrett-manager.schema";

type SecretsManagerInstance = {
    client: SecretsManagerClient | undefined,
    region: string,
    secret_name: string
}

const SECRET_NAME = constants.AWS.SECRET_MANAGER_SECRET_NAME;

let instance: SecretsManagerInstance;

export const getSecretManagerClientInstance = () :SecretsManagerInstance =>{
    if (instance) return instance;

    const region = constants.AWS.REGION;

    instance = {
        client: new SecretsManagerClient({
            region
        }),
        region,
        secret_name: SECRET_NAME
    };

    return instance;
};

let cachedSecret: unknown | undefined;

export const getSecretValueFromAWS = async (
    instance: SecretsManagerInstance = getSecretManagerClientInstance()
): Promise<secretManagerResponse>=>{
    if (cachedSecret) return cachedSecret as secretManagerResponse;

    try {
        const response = await instance.client?.send(
            new GetSecretValueCommand({
                SecretId: instance.secret_name
            })
        );
        console.log('response', response?.SecretString);
        const parsed = secretManagerResponseSchema.parse(JSON.parse(response?.SecretString ?? ""));

        cachedSecret = parsed;
        return parsed;
    } catch (error) {
        console.error("Secret fetching failed:", error);
        throw new Error("Secret fetching failed")
    }
};