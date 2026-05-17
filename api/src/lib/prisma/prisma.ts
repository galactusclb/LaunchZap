import { Signer } from "@aws-sdk/rds-signer";
import { PrismaPg } from "@prisma/adapter-pg";
import { readReplicas } from "@prisma/extension-read-replicas"
import { Pool } from "pg";

import { PrismaClient } from "@/prisma/client";

import "dotenv/config";

const DB_USER = process.env.DB_USER!
const DB_NAME = process.env.DB_NAME!
const DB_PORT = parseInt(process.env.DB_PORT ?? "5432")
const AWS_DEFAULT_REGION =  process.env.AWS_DEFAULT_REGION!
const RDS_PROXY_ENDPOINT = process.env.RDS_PROXY_ENDPOINT!

const createPool = async (host: string) =>{
    const signer = new Signer({
        hostname: host,
        port: DB_PORT,
        username: DB_USER,
        region: AWS_DEFAULT_REGION
    });

    const token = await signer.getAuthToken();

    return new Pool({
        host,
        user: DB_USER,
        database: DB_NAME,
        port: DB_PORT,
        ssl: { rejectUnauthorized: true },
        password: await token
    })
}

const mainAdapter = new PrismaPg(await createPool(RDS_PROXY_ENDPOINT));

const mainClient = new PrismaClient({ adapter: mainAdapter });

const replicaAdapter = new PrismaPg(await createPool(RDS_PROXY_ENDPOINT));

const readClient = new PrismaClient({ adapter: replicaAdapter});

const prisma = mainClient.$extends(
    readReplicas({
        replicas: [readClient]
    })
);

export default prisma;

export type PrismaTransactionClient = Omit<
    typeof prisma,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends' | '$primary' | '$replica'
>
