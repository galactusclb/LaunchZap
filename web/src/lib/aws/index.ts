import { S3Client } from "@aws-sdk/client-s3";

import { constants } from "@/utils/constants/server";

type S3Instance = {
    client: S3Client
    region: string
    bucket: string
}

let instance: S3Instance | undefined;

export const getS3ClientInstance = (): S3Instance => {
    if (instance) return instance;

    instance = {
        client: new S3Client({
            region: constants.AWS.REGION,
            credentials: {
                accessKeyId: constants.AWS.ACCESS_KEY_ID,
                secretAccessKey: constants.AWS.SECRET_ACCESS_KEY,
            }
        }),
        region: constants.AWS.REGION,
        bucket: constants.AWS.S3_BUCKET_NAME,
    };

    return instance;
};

export const buildS3Url = (key: string): string => {
    const { bucket, region } = getS3ClientInstance()
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}