//transactionController.js
import * as service from "../services/transactionService.js";

export async function fetchTransactions(req, res) {
  try {
    const data = await service.getTransactions(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function fetchTransactionById(req, res) {
  try {
    const doc = await service.getTransactionById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function fetchFilterOptions(req, res) {
  try {
    const opts = await service.getFilterOptions();
    res.json({ success: true, data: opts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function fetchAnalytics(req, res) {
  try {
    const analytics = await service.getAnalyticsSummary();
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
