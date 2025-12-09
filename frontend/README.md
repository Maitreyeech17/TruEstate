# Frontend

## 1. Overview
This is the frontend for the retail Management System. It provides an interactive interface for viewing transactions, applying filters, performing searches, sorting data, and navigating paginated results. The application is responsive and integrates seamlessly with a backend API for real-time data fetching.

## 2. Tech Stack
- **Framework:** React (Vite)
- **Styling:** CSS
- **State Management:** React `useState` & `useEffect`
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Hosting:** Vercel

## 3. Search Implementation Summary
The search bar allows users to search transactions by customer name, phone number, or other attributes. It triggers API calls on pressing `Enter` and updates the transaction list based on the search query.

## 4. Filter Implementation Summary
Filters are implemented using multi-select dropdowns and custom date/age pickers. Users can filter by:
- Customer Region
- Gender
- Age Range
- Product Category
- Tags
- Payment Method
- Date Range  

Selected filter values are sent to the API to fetch the filtered transaction list dynamically.

## 5. Sorting Implementation Summary
Sorting is handled using a dropdown component. Users can sort transactions by any supported field. Changing the sort option triggers a fresh API call with the selected sort parameter.

## 6. Pagination Implementation Summary
The transaction table supports pagination. The pagination component handles navigation across pages, and the current page is tracked in the state. API calls include the `page` parameter to fetch only the required records.

## 7. Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn

### Steps
1. Clone the repository:
   
Install dependencies:

npm install
Create a .env file in the root:

VITE_API_URL=https://your-backend-domain.com/api
Start the development server:

npm run dev
