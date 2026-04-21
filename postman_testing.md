# ExploreEase API Testing Guide with Postman

This document provides instructions on how to test the ExploreEase Travel Booking API using Postman.

## Setup

1. Download and install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Launch Postman and create a new Collection named "ExploreEase API".
3. Set up a collection variable:
   - Click on the collection name > Variables
   - Add a variable named `base_url` with the initial value `http://localhost` (or your server address)
   - Save the collection

## API Endpoints

### 1. GET All Packages

**Request:**
- Method: GET
- URL: `{{base_url}}/api/packages`
- Headers: None required

**Expected Response:**
- Status: 200 OK
- Body: JSON array of package objects

**Example Response:**
```json
[
  {
    "id": 1,
    "package_name": "Paris Adventure",
    "location": "Paris, France",
    "price": 1299.99,
    "start_date": "2023-12-15",
    "seats": 20
  },
  {
    "id": 2,
    "package_name": "Tokyo Explorer",
    "location": "Tokyo, Japan",
    "price": 1599.99,
    "start_date": "2023-11-10",
    "seats": 15
  }
]
```

### 2. GET Single Package

**Request:**
- Method: GET
- URL: `{{base_url}}/api/packages/1` (replace `1` with the desired package ID)
- Headers: None required

**Expected Response:**
- Status: 200 OK
- Body: JSON object of a single package

**Example Response:**
```json
{
  "id": 1,
  "package_name": "Paris Adventure",
  "location": "Paris, France",
  "price": 1299.99,
  "start_date": "2023-12-15",
  "seats": 20
}
```

**Error Response (Package Not Found):**
- Status: 404 Not Found
- Body: `{"error": "Package not found"}`

### 3. POST Create Package

**Request:**
- Method: POST
- URL: `{{base_url}}/api/packages`
- Headers: 
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "package_name": "Bali Paradise",
  "location": "Bali, Indonesia",
  "price": 899.99,
  "start_date": "2023-12-01",
  "seats": 25
}
```

**Expected Response:**
- Status: 201 Created
- Body: JSON object with the created package and success message

**Example Response:**
```json
{
  "message": "Package created successfully",
  "package": {
    "id": 3,
    "package_name": "Bali Paradise",
    "location": "Bali, Indonesia",
    "price": 899.99,
    "start_date": "2023-12-01",
    "seats": 25
  }
}
```

**Validation Error Response:**
- Status: 400 Bad Request
- Body: `{"error": "[Validation error message]"}`

### 4. PUT Update Package

**Request:**
- Method: PUT
- URL: `{{base_url}}/api/packages/3` (replace `3` with the desired package ID)
- Headers: 
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "package_name": "Bali Paradise Deluxe",
  "location": "Bali, Indonesia",
  "price": 999.99,
  "start_date": "2023-12-05",
  "seats": 20
}
```

**Expected Response:**
- Status: 200 OK
- Body: JSON object with the updated package and success message

**Example Response:**
```json
{
  "message": "Package updated successfully",
  "package": {
    "id": 3,
    "package_name": "Bali Paradise Deluxe",
    "location": "Bali, Indonesia",
    "price": 999.99,
    "start_date": "2023-12-05",
    "seats": 20
  }
}
```

**Error Responses:**
- Status: 404 Not Found - `{"error": "Package not found"}`
- Status: 400 Bad Request - `{"error": "[Validation error message]"}`

### 5. DELETE Package

**Request:**
- Method: DELETE
- URL: `{{base_url}}/api/packages/3` (replace `3` with the desired package ID)
- Headers: None required

**Expected Response:**
- Status: 200 OK
- Body: JSON object with success message

**Example Response:**
```json
{
  "message": "Package deleted successfully"
}
```

**Error Response:**
- Status: 404 Not Found - `{"error": "Package not found"}`

## Testing Validation Rules

### 1. Package Name Validation

**Request:**
- Method: POST
- URL: `{{base_url}}/api/packages`
- Body (raw JSON):
```json
{
  "package_name": "",
  "location": "Bali, Indonesia",
  "price": 899.99,
  "start_date": "2023-12-01",
  "seats": 25
}
```

**Expected Response:**
- Status: 400 Bad Request
- Body: `{"error": "Package name cannot be empty"}`

### 2. Price Validation

**Request:**
- Method: POST
- URL: `{{base_url}}/api/packages`
- Body (raw JSON):
```json
{
  "package_name": "Bali Paradise",
  "location": "Bali, Indonesia",
  "price": -50,
  "start_date": "2023-12-01",
  "seats": 25
}
```

**Expected Response:**
- Status: 400 Bad Request
- Body: `{"error": "Price must be numeric and greater than 0"}`

### 3. Location Validation

**Request:**
- Method: POST
- URL: `{{base_url}}/api/packages`
- Body (raw JSON):
```json
{
  "package_name": "Bali Paradise",
  "location": "",
  "price": 899.99,
  "start_date": "2023-12-01",
  "seats": 25
}
```

**Expected Response:**
- Status: 400 Bad Request
- Body: `{"error": "Location cannot be empty"}`

### 4. Start Date Validation

**Request:**
- Method: POST
- URL: `{{base_url}}/api/packages`
- Body (raw JSON):
```json
{
  "package_name": "Bali Paradise",
  "location": "Bali, Indonesia",
  "price": 899.99,
  "start_date": "2022-01-01",
  "seats": 25
}
```

**Expected Response:**
- Status: 400 Bad Request
- Body: `{"error": "Start date must be a future date"}`

### 5. Seats Validation

**Request:**
- Method: POST
- URL: `{{base_url}}/api/packages`
- Body (raw JSON):
```json
{
  "package_name": "Bali Paradise",
  "location": "Bali, Indonesia",
  "price": 899.99,
  "start_date": "2023-12-01",
  "seats": 0
}
```

**Expected Response:**
- Status: 400 Bad Request
- Body: `{"error": "Seats must be an integer greater than 0"}`

## Creating a Postman Collection

1. In Postman, click on "Collections" in the sidebar
2. Click the "New Collection" button
3. Name it "ExploreEase API"
4. Add each of the requests above as separate requests in the collection
5. For each request:
   - Set the appropriate HTTP method
   - Enter the URL with the variable `{{base_url}}`
   - Add any required headers
   - Add the request body for POST and PUT requests
   - Save the request

## Running Tests

1. Start your PHP server with the ExploreEase API
2. In Postman, open the ExploreEase API collection
3. Run each request individually to test the API endpoints
4. Verify that the responses match the expected responses
5. Test validation rules by sending invalid data

## Tips for Testing

- Create a package first using the POST endpoint
- Use the returned ID for subsequent GET, PUT, and DELETE operations
- Test validation rules by intentionally sending invalid data
- Check that error messages are descriptive and helpful
- Verify that successful operations return the expected status codes and data
- Test edge cases like updating a non-existent package or deleting an already deleted package