import path from "node:path";
import { z } from "zod";

const Environment = z.object({
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_ACCOUNT: z.string(),
    AWS_REGION: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),
});

const env = Environment.parse(process.env);

export const config = {
    aws: {
        account: env.AWS_ACCOUNT,
        region: env.AWS_REGION,
    },
    paths: {
        root: path.resolve(import.meta.dirname, "..", ".."),
    },
    database: {
        name: env.DATABASE_NAME,
        username: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
    },
} as const;
