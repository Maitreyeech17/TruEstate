# TruEstate Backend - Retail Sales Management System

## Overview

The backend API for TruEstate's Retail Sales Management System provides comprehensive transaction management with advanced search, filtering, sorting, and pagination capabilities. Built with Node.js and Express, it efficiently handles large-scale sales data stored in MongoDB Atlas, offering RESTful endpoints for real-time data retrieval and analysis. The system is optimized for performance with proper indexing and query optimization techniques.

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas (NoSQL)
- **ODM**: Mongoose
- **Environment Management**: dotenv
- **CORS**: cors middleware

## Search Implementation Summary

Search functionality is implemented using case-insensitive regex queries on the `Customer Name` and `Phone Number` fields. The search intelligently detects numeric input (for phone searches) versus text input (for name searches). Phone numbers stored as MongoDB `$numberLong` objects are handled seamlessly through regex pattern matching. The implementation preserves all active filters and sorting while searching, ensuring a smooth user experience. Search queries are optimized using MongoDB indexes on the Customer Name field.

## Filter Implementation Summary

Multi-select filtering is implemented using MongoDB's `$in` operator for categorical fields (Customer Region, Product Category, Gender, Payment Method) and `$gte`/`$lte` operators for range-based fields (Age, Date). Tags filtering uses regex matching to handle comma-separated tag strings stored in the database. All filters work independently and can be combined simultaneously through MongoDB's `$and` operator. The system efficiently handles multiple active filters without performance degradation, supporting complex queries like "East region + Beauty category + organic tags + Age 20-30" in a single database operation.

## Sorting Implementation Summary

Three sorting options are implemented: Date (newest first with `-1` descending order), Quantity (highest first), and Customer Name (A-Z alphabetical order). Sorting is applied after filtering using MongoDB's `.sort()` method with predefined sort objects. The default sort order is by date (newest first) to show the most recent transactions. Sorting maintains all active search queries and filters, ensuring data consistency. The implementation uses indexed fields for optimal query performance.

## Pagination Implementation Summary

Pagination is implemented with a fixed page size of 10 items per page using MongoDB's `.skip()` and `.limit()` methods. The system calculates the total number of pages based on filtered results using `countDocuments()`. Two parallel queries are executed for efficiency: one for paginated data and one for total count. Pagination state is preserved across filter, search, and sort operations. The API returns comprehensive pagination metadata including current page, page size, total records, and total pages for frontend implementation.

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account with cluster created
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the backend root directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/truestate?retryWrites=true&w=majority
   ```
   
   Replace `<username>`, `<password>`, and cluster details with your MongoDB Atlas credentials.

4. **Import dataset to MongoDB**
   - Open MongoDB Compass
   - Connect to your Atlas cluster
   - Create database: `truestate`
   - Create collection: `truEstate`
   - Import the provided CSV file into the collection

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   

6. **Verify installation**
   
   Test the health endpoint:
   ```bash
   curl http://localhost:5001/
   ```
   
   Expected response:
   ```json
   {
     "ok": true,
     "message": "TruEstate API",
     "database": "truestate",
     "collection": "truEstate"
   }
   ```

### API Endpoints

- `GET /api/transactions` - Fetch transactions with filters, search, sort, pagination
- `GET /api/transactions/options` - Get filter dropdown options
- `GET /api/transactions/analytics/summary` - Get analytics summary
- `GET /api/transactions/:id` - Get single transaction by ID


### Troubleshooting

**Issue: Empty response `{"data": [], "total": 0}`**
- Verify MongoDB connection string in `.env`
- Check database name is `truestate` and collection is `truEstate`
- Ensure data is imported correctly in MongoDB Compass

**Issue: Connection timeout**
- Check network connectivity
- Verify MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for development)
- Confirm MongoDB credentials are correct

**Issue: Module not found errors**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### Development

For development with auto-reload:
```bash
npm run dev
```

For production:
```bash
npm start
```

### Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── transactionController.js    # Request handlers
│   ├── services/
│   │   └── transactionService.js       # Business logic
│   ├── models/
│   │   └── transactionModel.js         # Mongoose schema
│   ├── routes/
│   │   └── transactionRoutes.js        # API routes
│   ├── utils/
│   │   └── db.js                       # Database connection
│   └── index.js                        # Entry point
├── .env                                # Environment variables
├── package.json
└── README.md
```