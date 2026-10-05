import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;
const priorities = ["LOW", "MEDIUM", "HIGH"] as const;
const examples: ReadonlyArray<readonly [string, string]> = [
  ["Unable to reset account password", "The password reset link expires before it opens. Please help me regain access."],
  ["Invoice payment not showing", "Our latest invoice was paid yesterday, but the billing page still shows it as outstanding."],
  ["Cannot access team workspace", "I am receiving a permission error when I try to open our shared workspace."],
  ["Feature request: export reports", "Could you add a CSV export option to the monthly analytics report?"],
  ["Order confirmation missing", "I placed an order this morning but have not received a confirmation email."],
  ["Two-factor code not arriving", "The verification code is not arriving at my registered email address."],
  ["Update billing details", "Please advise how to change the card on file for our subscription."],
  ["Dashboard loading slowly", "The dashboard takes several minutes to load for our account."],
  ["Duplicate charge on latest invoice", "My card appears to have been charged twice for the same subscription."],
  ["Team invitation failed", "Our new colleague cannot accept the invitation because the link is invalid."],
  ["Mobile app crashes on launch", "The iOS app closes immediately after the splash screen."],
  ["Request to close account", "Please let me know what is required to permanently close my account."],
  ["File upload gets stuck", "Uploads remain at 90 percent and never finish, even with small files."],
  ["Incorrect usage in analytics", "The usage chart does not match the activity recorded by our team."],
  ["Refund status update", "Could you share an update on the refund requested last week?"],
  ["Email notifications stopped", "I no longer receive notifications when a teammate replies to a ticket."],
  ["Integration connection expired", "Our project management integration disconnected and will not reconnect."],
  ["Change account owner", "We need to transfer account ownership to our new operations lead."],
  ["Cannot download statement", "The download button for our monthly statement returns an error."],
  ["Product walkthrough request", "Our team would appreciate a short walkthrough of the reporting tools."],
  ["Subscription plan change", "Please help us switch to the annual plan at our next renewal."],
  ["API key permissions question", "Can an API key be restricted to read-only access for our reporting tool?"],
  ["Accessibility issue in settings", "Keyboard focus is difficult to see on the account settings page."],
  ["Data import format guidance", "Which date format should we use when importing a customer CSV?"],
  ["Unexpected sign-out on mobile", "The mobile app signs me out every time I switch to another application."],
  ["Workspace logo will not update", "The logo uploader accepts the file but the old image remains visible."],
  ["New device verification issue", "I cannot verify my new laptop because the email code has already expired."],
  ["Search results are incomplete", "Search does not return older conversations that I know are in the account."],
  ["Restore archived project", "A project was archived by mistake. Can it be restored with its messages?"],
  ["Question about trial expiration", "Will our saved tickets remain available if we do not subscribe before trial end?"],
];
const domains = ["acme.example", "northstar.example", "brightpath.example", "fieldwork.example", "riverstone.example"];

async function main() {
  const existing = await prisma.ticket.count();
  if (existing > 0) {
    console.info(`Seed skipped; database already contains ${existing} tickets.`);
    return;
  }
  const now = Date.now();
  await prisma.ticket.createMany({
    data: examples.map(([title, description], index) => {
      const createdAt = new Date(now - index * 7 * 60 * 60 * 1000);
      const status = statuses[index % statuses.length];
      const priority = priorities[index % priorities.length];
      if (!status || !priority) throw new Error("Seed status or priority is missing.");
      return {
        title,
        description,
        customerEmail: `${["alex", "sam", "jordan", "taylor", "morgan"][index % 5]}${index + 1}@${domains[index % domains.length]}`,
        priority,
        status,
        createdAt,
        updatedAt: createdAt,
      };
    }),
  });
  console.info(`Seeded ${examples.length} support tickets.`);
}

main()
  .catch((error: unknown) => {
    console.error("Could not seed tickets:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
