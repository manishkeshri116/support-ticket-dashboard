import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({
      error: { code: "INVALID_JSON", message: "A valid JSON request body is required." },
    });
    return;
  }
  console.error("Unhandled API error", error);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "An unexpected server error occurred." },
  });
};
