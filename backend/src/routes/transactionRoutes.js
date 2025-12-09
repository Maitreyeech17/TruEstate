import express from "express";
import {
  fetchTransactions,
  fetchTransactionById,
  fetchFilterOptions,
  fetchAnalytics
} from "../controllers/transactionController.js";

const router = express.Router();

// GET /api/transactions?search=&regions=East,West&categories=Beauty&page=1&sort=date
router.get("/", fetchTransactions);

// GET /api/transactions/options
router.get("/options", fetchFilterOptions);

// GET /api/transactions/analytics/summary
router.get("/analytics/summary", fetchAnalytics);

// GET /api/transactions/:id
router.get("/:id", fetchTransactionById);

export default router;
