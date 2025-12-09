# TruEstate - System Architecture Document

## Table of Contents
1. [Backend Architecture](#backend-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Data Flow](#data-flow)
4. [Folder Structure](#folder-structure)
5. [Module Responsibilities](#module-responsibilities)

---

## Backend Architecture

### Overview
The backend follows a **layered MVC (Model-View-Controller) architecture** with clear separation of concerns. Built on Node.js and Express, it provides RESTful API endpoints for the frontend to consume.

### Architecture Layers

```
┌─────────────────────────────────────────┐
│         Client (Frontend)               │
└─────────────────┬───────────────────────┘
                  │ HTTP Requests
┌─────────────────▼───────────────────────┐
│         Routes Layer                    │
│  (API endpoint definitions)             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Controllers Layer                 │
│  (Request/Response handling)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Services Layer                   │
│  (Business logic & data processing)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Models Layer                    │
│  (Data schemas & DB interaction)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      MongoDB Atlas Database             │
│  (Data persistence)                     │
└─────────────────────────────────────────┘
```

### Design Patterns

1. **MVC Pattern**: Separates routing, business logic, and data access
2. **Service Layer Pattern**: Encapsulates business logic away from controllers
3. **Repository Pattern**: Mongoose models act as repositories for data access
4. **Dependency Injection**: Services are injected into controllers

### Key Features

- **RESTful API Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **Mongoose ODM**: Object-Document Mapping for MongoDB
- **Query Optimization**: Indexed fields for fast searches
- **Error Handling**: Centralized error handling with try-catch blocks
- **CORS Enabled**: Cross-Origin Resource Sharing for frontend communication
- **Environment Configuration**: Secure credential management via dotenv

### Database Design

**Database**: MongoDB Atlas (Cloud NoSQL)
**Collection**: `truEstate` in database `truestate`

**Document Schema**:
```javascript
{
  "Transaction ID": Number,
  "Date": Date,
  "Customer ID": String,
  "Customer Name": String,
  "Phone Number": Mixed ($numberLong),
  "Gender": String,
  "Age": Number,
  "Customer Region": String,
  "Customer Type": String,
  "Product ID": String,
  "Product Name": String,
  "Brand": String,
  "Product Category": String,
  "Tags": String (comma-separated),
  "Quantity": Number,
  "Price per Unit": Number,
  "Discount Percentage": Number,
  "Total Amount": Number,
  "Final Amount": Number,
  "Payment Method": String,
  "Order Status": String,
  "Delivery Type": String,
  "Store ID": String,
  "Store Location": String,
  "Salesperson ID": String,
  "Employee Name": String
}
```

**Indexes**:
- `Customer Name`: Standard index for text search
- `Customer Region`: Index for filtering
- `Product Category`: Index for filtering
- `Gender`: Index for filtering
- `Payment Method`: Index for filtering
- `Date`: Descending index for sorting
- `Age`: Index for range queries

---

## Frontend Architecture

### Overview
The frontend is built with **React** and follows a **component-based architecture**. It uses functional components with React Hooks for state management and side effects.

### Architecture Pattern

```
┌─────────────────────────────────────────┐
│            App.jsx                      │
│     (Root Component & State)            │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
┌───▼───┐ ┌──▼──┐  ┌───▼───┐ ┌──▼──┐
│Search │ │Filter│ │Table  │ │Pagi-│
│ Bar   │ │Panel │ │       │ │nation│
└───────┘ └──┬──┘  └───────┘ └─────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
┌───▼───┐┌──▼───┐┌──▼────┐┌──▼───┐
│Multi  ││Age   ││Date   ││Sort  │
│Select ││Range ││Range  ││Drop  │
│       ││      ││       ││down  │
└───────┘└──────┘└───────┘└──────┘
```

### State Management

**Centralized State** (in App.jsx):
- `transactions`: Array of fetched transaction data
- `filterOptions`: Available options for dropdowns
- `loading`: Loading state for async operations
- `error`: Error messages
- `search`: Search query string
- `selectedRegions`, `selectedCategories`, etc.: Filter selections
- `ageRange`, `dateRange`: Range filter values
- `sortBy`: Current sort option
- `currentPage`: Pagination state
- `pagination`: Pagination metadata

**State Flow**:
```
User Interaction → Component Event Handler → 
State Update (setState) → useEffect Trigger → 
API Call → Response → State Update → Re-render
```

### Component Architecture

**Smart Components** (Stateful):
- `App.jsx`: Main container with all state management

**Dumb Components** (Presentational):
- `SearchBar`: Search input field
- `FilterPanel`: Container for all filters
- `MultiSelectDropdown`: Reusable multi-select filter
- `AgeRangeDropdown`: Age range input
- `DateRangeDropdown`: Date range picker
- `SortDropdown`: Sort options selector
- `StatsBoxes`: Statistics display cards
- `TransactionTable`: Data table display
- `Pagination`: Page navigation controls
- `LoadingSpinner`: Loading indicator

### Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Component-level Styling**: Styles defined within components
- **Theme Configuration**: Custom colors in tailwind.config.js

### API Integration

**Service Layer** (`services/api.js`):
- Centralized Axios instance
- API endpoint functions
- Error handling
- Request/response interceptors

---

## Data Flow

### Complete Request-Response Cycle

```
┌──────────────────────────────────────────────────────────────┐
│  1. USER INTERACTION                                         │
│     User types in search, selects filters, changes page      │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  2. STATE UPDATE (Frontend)                                  │
│     React setState updates component state                   │
│     useEffect detects dependency change                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  3. API SERVICE CALL                                         │
│     services/api.js → axios.get('/api/transactions', params) │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  4. BACKEND ROUTE HANDLING                                   │
│     Express routes → transactionRoutes.js                    │
│     GET /api/transactions                                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  5. CONTROLLER PROCESSING                                    │
│     transactionController.js → fetchTransactions()           │
│     Extracts query params, calls service                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  6. SERVICE LAYER LOGIC                                      │
│     transactionService.js → getTransactions()                │
│     - Builds MongoDB filter object                           │
│     - Constructs $and query with all filters                 │
│     - Applies search regex                                   │
│     - Sets sort options                                      │
│     - Calculates pagination skip/limit                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  7. DATABASE QUERY                                           │
│     Mongoose Model → Transaction.find(filter)                │
│     MongoDB executes query with indexes                      │
│     Parallel queries: data fetch + count                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  8. DATA NORMALIZATION                                       │
│     Service layer normalizes:                                │
│     - Phone Number ($numberLong → String)                    │
│     - Date ($date → ISO String)                              │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  9. RESPONSE FORMATTING                                      │
│     Controller formats JSON response:                        │
│     { success: true, data: [], pagination: {} }              │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  10. FRONTEND DATA RECEPTION                                 │
│      API service receives response                           │
│      App.jsx updates state with new data                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  11. UI RE-RENDER                                            │
│      React re-renders components                             │
│      TransactionTable displays new data                      │
│      Pagination updates page numbers                         │
└──────────────────────────────────────────────────────────────┘
```

### Filter Combination Logic

Multiple filters are combined using MongoDB's `$and` operator:

```javascript
// Example: Region=East + Category=Beauty + Age 20-30
{
  $and: [
    { "Customer Region": { $in: ["East"] } },
    { "Product Category": { $in: ["Beauty"] } },
    { "Age": { $gte: 20, $lte: 30 } }
  ]
}
```

### Search + Filter Interaction

Search works alongside filters without conflicts:

```javascript
// Example: Search "Khan" + Region=East
{
  $and: [
    {
      $or: [
        { "Customer Name": { $regex: "Khan", $options: "i" } },
        { "Phone Number": { $regex: "Khan", $options: "i" } }
      ]
    },
    { "Customer Region": { $in: ["East"] } }
  ]
}
```

---

## Folder Structure

### Complete Project Structure

```
root/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── transactionController.js      # HTTP request handlers
│   │   │
│   │   ├── services/
│   │   │   └── transactionService.js         # Business logic & data processing
│   │   │
│   │   ├── models/
│   │   │   └── transactionModel.js           # Mongoose schema & indexes
│   │   │
│   │   ├── routes/
│   │   │   └── transactionRoutes.js          # API route definitions
│   │   │
│   │   ├── utils/
│   │   │   └── db.js                         # MongoDB connection utility
│   │   │
│   │   └── index.js                          # Express app entry point
│   │
│   ├── .env                                  # Environment variables (gitignored)
│   ├── .gitignore
│   ├── package.json                          # Dependencies & scripts
│   └── README.md                             # Backend documentation
│
├── frontend/
│   ├── public/
│   │   └── index.html                        # HTML template
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx                 # Search input component
│   │   │   ├── FilterPanel.jsx               # Filter container component
│   │   │   ├── MultiSelectDropdown.jsx       # Reusable multi-select filter
│   │   │   ├── AgeRangeDropdown.jsx          # Age range filter
│   │   │   ├── DateRangeDropdown.jsx         # Date range filter
│   │   │   ├── SortDropdown.jsx              # Sort options dropdown
│   │   │   ├── StatsBoxes.jsx                # Statistics cards
│   │   │   ├── TransactionTable.jsx          # Data table component
│   │   │   ├── Pagination.jsx                # Pagination controls
│   │   │   └── LoadingSpinner.jsx            # Loading indicator
│   │   │
│   │   ├── services/
│   │   │   └── api.js                        # Axios API service layer
│   │   │
│   │   ├── App.jsx                           # Root component
│   │   ├── App.css                           # Global styles
│   │   └── main.jsx                          # React entry point
│   │
│   ├── .env                                  # Frontend environment variables
│   ├── .gitignore
│   ├── package.json                          # Dependencies & scripts
│   ├── tailwind.config.js                    # Tailwind CSS configuration
│   ├── postcss.config.js                     # PostCSS configuration
│   ├── vite.config.js                        # Vite build configuration
│   └── README.md                             # Frontend documentation
│
├── docs/
│   └── architecture.md                       # This document
│
├── .gitignore                                # Root gitignore
├── README.md                                 # Project overview
└── package.json                              # Monorepo scripts (optional)
```

---

## Module Responsibilities

### Backend Modules

#### 1. **index.js** (Entry Point)
**Responsibilities**:
- Initialize Express application
- Apply middleware (CORS, JSON parser)
- Connect to MongoDB database
- Mount API routes
- Start HTTP server
- Handle server-level errors

**Dependencies**: Express, CORS, dotenv, db utility, routes

---

#### 2. **utils/db.js** (Database Connection)
**Responsibilities**:
- Establish MongoDB Atlas connection
- Configure connection options
- Verify database and collection existence
- Log connection status
- Handle connection errors
- Provide connection event listeners

**Dependencies**: Mongoose

---

#### 3. **models/transactionModel.js** (Data Schema)
**Responsibilities**:
- Define Mongoose schema matching CSV structure
- Create database indexes for optimized queries
- Export Mongoose model for data access
- Handle special field types (Mixed for Phone Number)
- Map collection name to database

**Dependencies**: Mongoose

---

#### 4. **routes/transactionRoutes.js** (API Routes)
**Responsibilities**:
- Define RESTful endpoint paths
- Map HTTP methods to controller functions
- Structure: GET /api/transactions, GET /api/transactions/:id, etc.
- Export router for mounting in main app

**Dependencies**: Express Router, Controllers

---

#### 5. **controllers/transactionController.js** (Request Handlers)
**Responsibilities**:
- Extract request parameters (query, params, body)
- Call appropriate service functions
- Format HTTP responses (success/error)
- Handle HTTP status codes (200, 404, 500)
- Catch and log errors
- Send JSON responses to client

**Functions**:
- `fetchTransactions()`: Handle GET /api/transactions
- `fetchTransactionById()`: Handle GET /api/transactions/:id
- `fetchFilterOptions()`: Handle GET /api/transactions/options
- `fetchAnalytics()`: Handle GET /api/transactions/analytics/summary

**Dependencies**: Service layer

---

#### 6. **services/transactionService.js** (Business Logic)
**Responsibilities**:
- Implement core business logic
- Build MongoDB query filters
- Process multi-select filters ($in operator)
- Handle search with regex (case-insensitive)
- Implement age and date range filtering
- Apply sorting logic
- Calculate pagination (skip/limit)
- Normalize response data (Phone Number, Date)
- Execute parallel queries (data + count)
- Return formatted results with pagination metadata

**Functions**:
- `getTransactions(params)`: Main query function
- `getTransactionById(id)`: Fetch single transaction
- `getFilterOptions()`: Get distinct filter values
- `getAnalyticsSummary()`: Calculate statistics
- `escapeRegex(str)`: Helper for regex escaping

**Dependencies**: Transaction model

---

### Frontend Modules

#### 1. **main.jsx** (React Entry)
**Responsibilities**:
- Mount React app to DOM
- Render root App component
- Import global CSS

**Dependencies**: React, ReactDOM, App component

---

#### 2. **App.jsx** (Root Component)
**Responsibilities**:
- Manage all application state (filters, search, sort, pagination)
- Fetch filter options on mount
- Trigger API calls on state changes (useEffect)
- Coordinate data flow between components
- Handle filter reset logic
- Pass props to child components
- Render layout structure

**State Management**:
- Transaction data
- Filter selections
- Search query
- Sort option
- Pagination state
- Loading and error states

**Dependencies**: All presentational components, API service

---

#### 3. **services/api.js** (API Service Layer)
**Responsibilities**:
- Create configured Axios instance
- Define API endpoint functions
- Handle HTTP requests/responses
- Format request parameters
- Process API errors
- Return promise-based results

**Functions**:
- `getTransactions(params)`: Fetch paginated transactions
- `getFilterOptions()`: Fetch filter dropdown options
- `getTransactionById(id)`: Fetch single transaction
- `getAnalytics()`: Fetch analytics summary

**Dependencies**: Axios

---

#### 4. **components/SearchBar.jsx**
**Responsibilities**:
- Render search input field
- Handle user input changes
- Trigger search on Enter key
- Display search icon
- Pass search value to parent

**Props**: `value`, `onChange`, `onSearch`

---

#### 5. **components/FilterPanel.jsx**
**Responsibilities**:
- Organize filter components horizontally
- Render refresh/reset button
- Pass filter state to child dropdowns
- Coordinate filter component layout

**Props**: All filter states and setters, `onReset`, `hasActiveFilters`

---

#### 6. **components/MultiSelectDropdown.jsx**
**Responsibilities**:
- Render dropdown with checkbox options
- Handle multi-select logic
- Toggle dropdown open/close
- Show selected count badge
- Close on outside click
- Highlight active state

**Props**: `label`, `options`, `selected`, `onChange`

**Reusable for**: Regions, Categories, Tags, Gender, Payment Methods

---

#### 7. **components/AgeRangeDropdown.jsx**
**Responsibilities**:
- Render min/max age inputs
- Validate numeric input
- Show active state when values set
- Clear functionality
- Close on outside click

**Props**: `ageRange`, `setAgeRange`

---

#### 8. **components/DateRangeDropdown.jsx**
**Responsibilities**:
- Render start/end date pickers
- Handle date input changes
- Show active state when dates set
- Clear functionality
- Close on outside click

**Props**: `dateRange`, `setDateRange`

---

#### 9. **components/SortDropdown.jsx**
**Responsibilities**:
- Display current sort option
- Render sort options list
- Handle sort selection
- Close on selection
- Highlight active option

**Props**: `value`, `onChange`

**Options**: Date (newest), Quantity (high to low), Customer Name (A-Z)

---

#### 10. **components/StatsBoxes.jsx**
**Responsibilities**:
- Calculate total units sold
- Calculate total amount
- Calculate total discount
- Display statistics in cards
- Show info tooltips
- Format currency values

**Props**: `transactions`

---

#### 11. **components/TransactionTable.jsx**
**Responsibilities**:
- Render data table with 13 columns
- Format date values (DD MMM YYYY)
- Format currency values (₹ symbol)
- Display all transaction fields
- Apply row hover effects
- Handle empty values gracefully

**Props**: `transactions`

**Columns**: Transaction ID, Date, Customer ID, Customer Name, Phone Number, Gender, Age, Product Category, Quantity, Total Amount, Customer Region, Product ID, Employee Name

---

#### 12. **components/Pagination.jsx**
**Responsibilities**:
- Calculate visible page numbers
- Render Previous/Next buttons
- Highlight current page
- Show ellipsis for large page counts
- Disable buttons at boundaries
- Handle page change events

**Props**: `currentPage`, `totalPages`, `onPageChange`

**Logic**: Shows max 7 pages with ellipsis for overflow

---

#### 13. **components/LoadingSpinner.jsx**
**Responsibilities**:
- Display loading animation
- Show loading message
- Provide visual feedback during API calls

**Props**: None (stateless)

---

### Shared Responsibilities

#### Error Handling
- **Backend**: Try-catch blocks in controllers, error responses with status codes
- **Frontend**: Error state management, user-friendly error messages

#### Data Validation
- **Backend**: Type checking, range validation, regex escaping
- **Frontend**: Input validation, empty state handling

#### Performance Optimization
- **Backend**: Database indexing, parallel queries, lean() for faster queries
- **Frontend**: useEffect dependency optimization, component memoization potential

---

## Technology Stack Summary

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose 7.x
- **Utilities**: dotenv, cors

### Frontend
- **Library**: React 18+
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **HTTP Client**: Axios 1.x
- **Icons**: lucide-react

### DevOps
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: Node.js environment variables
- **Deployment**: (To be configured - Vercel/Netlify for frontend, Render/Railway for backend)

---

## Design Decisions

### Why MongoDB?
- Flexible schema for CSV-like data
- Fast reads with proper indexing
- Cloud-hosted (Atlas) for easy deployment
- No complex joins needed for this use case

### Why React?
- Component reusability (MultiSelectDropdown)
- Efficient re-rendering with Virtual DOM
- Rich ecosystem and community support
- Hooks for clean state management

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- No CSS naming conflicts
- Responsive design utilities

### Why Separate Service Layer?
- Clean separation of concerns
- Easier testing and maintenance
- Reusable business logic
- Controller stays thin and focused

---

## Security Considerations

1. **Environment Variables**: Sensitive data (DB credentials) in .env files
2. **CORS**: Configured to allow frontend origin only
3. **Input Validation**: Regex escaping prevents injection attacks
4. **Error Messages**: Generic errors to users, detailed logs for developers
5. **MongoDB**: Using parameterized queries (Mongoose) prevents NoSQL injection

---

## Future Enhancements

1. **Backend**:
   - Add authentication/authorization (JWT)
   - Implement rate limiting
   - Add API documentation (Swagger)
   - Implement caching (Redis)
   - Add logging (Winston/Morgan)

2. **Frontend**:
   - Add user authentication
   - Implement advanced analytics dashboard
   - Add export functionality (CSV/Excel)
   - Implement real-time updates (WebSockets)
   - Add dark mode support

3. **Infrastructure**:
   - CI/CD pipeline
   - Automated testing (Jest, React Testing Library)
   - Docker containerization
   - Monitoring and alerting

---
