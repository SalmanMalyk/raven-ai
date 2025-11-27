import logger from "@/utils/logger";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

export const saveDelegateEmail = tool(
    ({ email }: { email: string }) => {
        logger.info(`Saving delegate email: ${email}`);
    },
    {
        name: "saveDelegateEmailToDatabase",
        description: "Save delegate email",
        schema: z.object({
            email: z.string().email(),
        }),
    }
);