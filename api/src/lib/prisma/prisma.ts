import { PrismaPg } from "@prisma/adapter-pg";
import { readReplicas } from "@prisma/extension-read-replicas"

import { PrismaClient } from "@/prisma/client";

import "dotenv/config";

const mainAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, });

const mainClient = new PrismaClient({ adapter: mainAdapter });

const replicaAdapter = new PrismaPg({ connectionString:  process.env.DATABASE_URL_READ!});

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
