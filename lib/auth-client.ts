import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  credentials: "include", // Important for cookies
  plugins: [
    emailOTPClient(),
    adminClient()
  ],
  fetchOptions: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});