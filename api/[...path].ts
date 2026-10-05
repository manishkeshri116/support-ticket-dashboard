import { PrismaClient } from "@prisma/client";
import { createApp } from "../backend/src/app.js";

const prisma = new PrismaClient();
const app = createApp(prisma);

export default app;
