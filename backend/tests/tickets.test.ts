import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app.js";

const sampleTicket = {
  id: 1,
  title: "Billing question",
  description: "I have a question about my latest invoice.",
  customerEmail: "alex@example.com",
  priority: "HIGH" as const,
  status: "OPEN" as const,
  createdAt: new Date("2026-10-05T10:00:00.000Z"),
  updatedAt: new Date("2026-10-05T10:00:00.000Z"),
};

const ticketDelegate = {
  count: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
};
const app = createApp({ ticket: ticketDelegate as unknown as PrismaClient["ticket"] });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ticket API", () => {
  it("allows the deployed frontend origin through CORS", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", "https://support-ticket-dashboard-ashen.vercel.app");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://support-ticket-dashboard-ashen.vercel.app",
    );
  });

  it("validates required fields, email, and the 120-character title limit", async () => {
    const invalid = await request(app).post("/api/tickets").send({
      title: "x".repeat(121),
      description: "",
      customerEmail: "not-an-email",
      priority: "Urgent",
    });
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe("VALIDATION_ERROR");
    expect(invalid.body.error.details).toMatchObject({
      title: "Title must be 120 characters or fewer.",
      description: "Description is required.",
      customerEmail: "Enter a valid email address.",
    });
    expect(ticketDelegate.create).not.toHaveBeenCalled();
  });

  it("combines search and filters, and paginates with the requested ordering", async () => {
    ticketDelegate.findMany.mockResolvedValue([sampleTicket]);
    ticketDelegate.count.mockResolvedValue(1);
    const response = await request(app).get(
      "/api/tickets?search=billing&status=Open&priority=High&sort=oldest&page=2&perPage=5",
    );
    expect(response.status).toBe(200);
    expect(ticketDelegate.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        OR: [
          { title: { contains: "billing", mode: "insensitive" } },
          { customerEmail: { contains: "billing", mode: "insensitive" } },
        ],
        status: "OPEN",
        priority: "HIGH",
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip: 5,
      take: 5,
    }));
    expect(response.body.pagination).toEqual({ page: 2, perPage: 5, total: 1, totalPages: 1 });
  });

  it("creates tickets with default status and updates persistently through the database", async () => {
    ticketDelegate.create.mockResolvedValue(sampleTicket);
    const created = await request(app).post("/api/tickets").send({
      title: sampleTicket.title,
      description: sampleTicket.description,
      customerEmail: sampleTicket.customerEmail,
      priority: "High",
    });
    expect(created.status).toBe(201);
    expect(ticketDelegate.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ priority: "HIGH", status: "OPEN" }),
    });

    ticketDelegate.update.mockResolvedValue({ ...sampleTicket, status: "RESOLVED", priority: "LOW" });
    const updated = await request(app).patch("/api/tickets/1").send({ status: "Resolved", priority: "Low" });
    expect(updated.status).toBe(200);
    expect(ticketDelegate.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: "RESOLVED", priority: "LOW" },
    });
    expect(updated.body.ticket).toMatchObject({ status: "Resolved", priority: "Low" });
  });

  it("returns summary counts across all tickets", async () => {
    ticketDelegate.count
      .mockResolvedValueOnce(30)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(11)
      .mockResolvedValueOnce(9);
    const response = await request(app).get("/api/summary");
    expect(response.body).toEqual({ total: 30, open: 10, inProgress: 11, resolved: 9 });
  });
});
