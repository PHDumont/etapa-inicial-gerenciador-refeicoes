/**
 * Vitest replaces `@clerk/express` with this module (see vitest.config.js).
 * Keep TEST_CLERK_USER_ID aligned with users created in integration tests.
 */
export const TEST_CLERK_USER_ID = "user_integration_test_fixture_01";

export function clerkMiddleware() {
  return (_req, _res, next) => next();
}

export function getAuth(_req) {
  return { userId: TEST_CLERK_USER_ID };
}
