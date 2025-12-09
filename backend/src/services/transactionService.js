import Transaction from "../models/transactionModel.js";

/**
 * Optimized search implementation with proper handling of MongoDB types
 */
export async function getTransactions(params = {}) {
  const {
    search,
    regions,
    categories,
    tags,
    gender,
    ageMin,
    ageMax,
    paymentMethods,
    dateStart,
    dateEnd,
    sort,
    page = 1
  } = params;

  const filterArr = [];

  // --- OPTIMIZED SEARCH: Customer Name & Phone Number ---
  if (search && String(search).trim()) {
    const searchTerm = String(search).trim();
    const escapedSearch = escapeRegex(searchTerm);
    
    // Check if search term is numeric (for phone search)
    const isNumeric = /^\d+$/.test(searchTerm);
    
    if (isNumeric) {
      // Phone number search - handle both string and $numberLong formats
      filterArr.push({
        $or: [
          { "Phone Number": { $regex: escapedSearch, $options: "i" } },
          { "Customer Name": { $regex: escapedSearch, $options: "i" } }
        ]
      });
    } else {
      // Text search on Customer Name only
      filterArr.push({
        "Customer Name": { $regex: escapedSearch, $options: "i" }
      });
    }
  }

  // --- MULTI-SELECT FILTERS ---
  // Helper to build $in filter from comma-separated values
  function buildInFilter(field, values) {
    const valArray = values.split(",").map(v => v.trim()).filter(Boolean);
    if (valArray.length === 0) return null;
    return { [field]: { $in: valArray } };
  }

  // Apply multi-select filters
  if (regions) {
    const filter = buildInFilter("Customer Region", regions);
    if (filter) filterArr.push(filter);
  }
  
  if (categories) {
    const filter = buildInFilter("Product Category", categories);
    if (filter) filterArr.push(filter);
  }
  
  if (gender) {
    const filter = buildInFilter("Gender", gender);
    if (filter) filterArr.push(filter);
  }
  
  if (paymentMethods) {
    const filter = buildInFilter("Payment Method", paymentMethods);
    if (filter) filterArr.push(filter);
  }

  // --- TAGS FILTER (Multi-select, case-insensitive) ---
  // Tags are stored as comma-separated string: "organic,skincare"
  if (tags) {
    const tagArr = tags.split(",").map(t => t.trim()).filter(Boolean);
    if (tagArr.length > 0) {
      // Match if ANY selected tag is present in the Tags field
      filterArr.push({
        $or: tagArr.map(tag => ({
          "Tags": { 
            $regex: new RegExp(`(^|,|\\s)${escapeRegex(tag)}(,|\\s|$)`, "i") 
          }
        }))
      });
    }
  }

  // --- AGE RANGE FILTER ---
  if (ageMin || ageMax) {
    const ageFilter = {};
    if (ageMin) ageFilter.$gte = Number(ageMin);
    if (ageMax) ageFilter.$lte = Number(ageMax);
    filterArr.push({ "Age": ageFilter });
  }

  // --- DATE RANGE FILTER ---
  if (dateStart || dateEnd) {
    const dateFilter = {};
    if (dateStart) {
      const startDate = new Date(dateStart);
      startDate.setHours(0, 0, 0, 0);
      dateFilter.$gte = startDate;
    }
    if (dateEnd) {
      const endDate = new Date(dateEnd);
      endDate.setHours(23, 59, 59, 999);
      dateFilter.$lte = endDate;
    }
    filterArr.push({ "Date": dateFilter });
  }

  // --- COMBINE FILTERS ---
  const finalFilter = filterArr.length > 0 ? { $and: filterArr } : {};

  // --- SORTING ---
  const sortMap = {
    date: { "Date": -1 },          // Newest first
    quantity: { "Quantity": -1 },   // Highest first
    name: { "Customer Name": 1 }    // A-Z
  };
  const sortOption = sortMap[sort] || { "Date": -1 }; // Default: newest first

  // --- PAGINATION ---
  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = 10;
  const skip = (pageNum - 1) * pageSize;

  // --- EXECUTE QUERY ---
  try {
    const [results, total] = await Promise.all([
      Transaction.find(finalFilter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      Transaction.countDocuments(finalFilter).exec()
    ]);

    // --- NORMALIZE RESPONSE DATA ---
    const normalized = results.map(doc => {
      // Handle Phone Number ($numberLong to string)
      if (doc["Phone Number"]) {
        if (typeof doc["Phone Number"] === "object" && doc["Phone Number"].$numberLong) {
          doc["Phone Number"] = String(doc["Phone Number"].$numberLong);
        } else {
          doc["Phone Number"] = String(doc["Phone Number"]);
        }
      }

      // Handle Date ($date to ISO string)
      if (doc["Date"]) {
        if (typeof doc["Date"] === "object" && doc["Date"].$date) {
          doc["Date"] = new Date(doc["Date"].$date).toISOString();
        } else if (doc["Date"] instanceof Date) {
          doc["Date"] = doc["Date"].toISOString();
        }
      }

      return doc;
    });

    return {
      data: normalized,
      pagination: {
        page: pageNum,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Query error:", error);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}

/**
 * Get single transaction by ID
 */
export async function getTransactionById(id) {
  try {
    const doc = await Transaction.findById(id).lean().exec();
    
    if (!doc) return null;

    // Normalize phone and date
    if (doc["Phone Number"]) {
      if (typeof doc["Phone Number"] === "object" && doc["Phone Number"].$numberLong) {
        doc["Phone Number"] = String(doc["Phone Number"].$numberLong);
      } else {
        doc["Phone Number"] = String(doc["Phone Number"]);
      }
    }

    if (doc["Date"]) {
      if (typeof doc["Date"] === "object" && doc["Date"].$date) {
        doc["Date"] = new Date(doc["Date"].$date).toISOString();
      } else if (doc["Date"] instanceof Date) {
        doc["Date"] = doc["Date"].toISOString();
      }
    }

    return doc;
  } catch (error) {
    throw new Error(`Failed to fetch transaction: ${error.message}`);
  }
}

/**
 * Get distinct filter options for dropdown population
 */
export async function getFilterOptions() {
  try {
    const [
      regions,
      categories,
      genders,
      paymentMethods,
      tags
    ] = await Promise.all([
      Transaction.distinct("Customer Region").exec(),
      Transaction.distinct("Product Category").exec(),
      Transaction.distinct("Gender").exec(),
      Transaction.distinct("Payment Method").exec(),
      Transaction.distinct("Tags").exec()
    ]);

    // Parse tags (they're stored as comma-separated strings)
    const uniqueTags = new Set();
    tags.forEach(tagString => {
      if (tagString) {
        tagString.split(",").forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) uniqueTags.add(trimmed);
        });
      }
    });

    return {
      regions: regions.filter(Boolean).sort(),
      categories: categories.filter(Boolean).sort(),
      genders: genders.filter(Boolean).sort(),
      paymentMethods: paymentMethods.filter(Boolean).sort(),
      tags: Array.from(uniqueTags).sort()
    };
  } catch (error) {
    throw new Error(`Failed to fetch filter options: ${error.message}`);
  }
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary() {
  try {
    const [
      totalTransactions,
      totalRevenue,
      avgOrderValue,
      topCategories
    ] = await Promise.all([
      Transaction.countDocuments().exec(),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$Final Amount" } } }
      ]).exec(),
      Transaction.aggregate([
        { $group: { _id: null, avg: { $avg: "$Final Amount" } } }
      ]).exec(),
      Transaction.aggregate([
        { $group: { _id: "$Product Category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).exec()
    ]);

    return {
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      avgOrderValue: avgOrderValue[0]?.avg || 0,
      topCategories: topCategories.map(c => ({
        category: c._id,
        count: c.count
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }
}

/**
 * Helper: Escape special regex characters
 */
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}