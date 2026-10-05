CREATE TYPE "TicketStatus" AS ENUM ('Open', 'In Progress', 'Resolved');
CREATE TYPE "TicketPriority" AS ENUM ('Low', 'Medium', 'High');

CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "customer_email" VARCHAR(254) NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'Medium',
    "status" "TicketStatus" NOT NULL DEFAULT 'Open',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "tickets_created_at_idx" ON "tickets"("created_at");
CREATE INDEX "tickets_status_priority_idx" ON "tickets"("status", "priority");
