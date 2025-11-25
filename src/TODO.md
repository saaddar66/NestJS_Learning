# ToDo for JWT Authentication Implementation

- [ ] Update src/users/users.service.ts:
      - Hash user passwords using bcrypt on user creation.
- [ ] Update src/auth/auth.controller.ts:
      - Add POST /auth/login endpoint.
      - Accept email and password.
      - Use AuthService.validateUser and AuthService.login to return JWT if validated.
- [ ] Update src/main.ts:
      - Import and apply global AuthGuard('jwt') so all endpoints require authentication.
- [ ] Test the complete flow with:
      - User creation with hashed password.
      - Login endpoint returning JWT token.
      - Accessing other endpoints protected by JWT auth.

Notes:
- Roles support is on hold as per user instruction.
- The JWT secret and expiration are already configured in AuthModule.
