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
