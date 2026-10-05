import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createApp } from "./app.js";

const prisma = new PrismaClient();
const port = Number(process.env.PORT ?? 5002);
const app = createApp(prisma);

const server = app.listen(port, () => {
  console.info(`Support ticket API listening on http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
