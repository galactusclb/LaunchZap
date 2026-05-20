import { Signer } from "@aws-sdk/rds-signer";

const signer = new Signer({
    hostname: process.env.RDS_PROXY_ENDPOINT!,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    username: process.env.DB_USER!,
    region: process.env.AWS_DEFAULT_REGION!,
});

export const getRDSAuthToken = () => signer.getAuthToken();