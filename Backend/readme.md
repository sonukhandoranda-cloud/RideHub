# Users API — /users/register

## Endpoint
- **POST** /users/register

## Description
Creates a new user account, hashes the password, and returns a JWT token plus the created user (password is not returned).

## Request Headers
- `Content-Type: application/json`

## Request Body (JSON)
{
  "fullname": {
    "firstname": "string (required, min 3)",
    "lastname": "string (optional, min 3)"
  },
  "email": "string (required, min 5)",
  "password": "string (required)"
}

Field requirements enforced by the application:
- `fullname.firstname`: required, minimum length 3.
- `fullname.lastname`: optional, if provided minimum length 3.
- `email`: required, unique, minimum length 5.
- `password`: required (will be hashed before saving).



## Notes
- Passwords are hashed via bcrypt before saving.
- A JWT is generated using `process.env.JWT_SECRET` and returned as `token` on success.
- The saved `user` object will not include the password field in the response.

## Example curl
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname":"Jane","lastname":"Doe"},
    "email":"jane.doe@example.com",
    "password":"S3cureP@ss"
  }'
```

## Example Success Response (201)
{
  "token": "eyJhbGci...",
  "user": {
    "_id": "64abf...",
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane.doe@example.com",
    "socketId": null,
    "__v": 0
  }
}

---

## GET /users/profile

- **Description**: Returns the authenticated user's profile.
- **Method**: GET /users/profile
- **Authentication**: Required — provide the JWT either in an `Authorization: Bearer <token>` header or as the `token` cookie.

## Responses / Status Codes (profile)
- 200 OK
  - Body: the `user` object (password omitted).
- 401 Unauthorized
  - Missing or invalid authentication token.
- 500 Internal Server Error
  - Unexpected server errors.

## Example curl (profile)
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your_jwt_here>"
```

---

## POST /users/logout

- **Description**: Logs the user out by clearing the `token` cookie and adding the token to a blacklist so it can't be used again.
- **Method**: POST /users/logout
- **Authentication**: Should be called with the JWT in the cookie or `Authorization` header so the server can blacklist it.

## Responses / Status Codes (logout)
- 200 OK
  - Body: `{ "message": "Logged out successfully" }`
- 400/401
  - If no token is provided or token is invalid; client may receive an error depending on how the request is made.
- 500 Internal Server Error
  - Unexpected server errors.

## Example curl (logout)
```bash
curl -X POST http://localhost:3000/users/logout \
  -H "Authorization: Bearer <your_jwt_here>"
```

## Notes (profile & logout)


## Captains API — routes/captain.routes.js

### POST /captains/register

- **Description**: Create a new captain (driver) account with vehicle details. Password is hashed before saving.
- **Method**: POST /captains/register
- **Authentication**: Not required for registration.

## Request Headers
- `Content-Type: application/json`

## Request Body (JSON) — example with inline comments for requirements
```json
{
  "fullname": {
    "firstname": "John", // required, min length 3
    "lastname": "Driver" // optional, if present min length 3
  },
  "email": "john.driver@example.com", // required, must be a valid email, unique
  "password": "DriverP@ss1", // required, min length 6 (will be hashed)
  "vehicles": {
    "colour": "Blue",     // required, min length 3
    "plate": "XYZ123",    // required, min length 3
    "capacity": 4,          // required, integer, min 1
    "vehicleType": "car"  // required, one of: "car", "motorcycle", "auto"
  }
}
```

> Note: JSON does not support comments; the `//` lines above are for documentation only — remove them when sending real JSON.

## Example Success Response (201) — JSON with comments
```json
{
  "token": "eyJhbGci...", // JWT for authenticating captain requests
  "captain": {
    "_id": "64abf...",
    "fullname": { "firstname": "John", "lastname": "Driver" },
    "email": "john.driver@example.com",
    "vehicles": {
      "colour": "Blue",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "socketId": null,
    "__v": 0
  }
}
```

