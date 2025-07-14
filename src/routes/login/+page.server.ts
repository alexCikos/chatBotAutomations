import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const remember = data.get("remember") === "on";

    // Basic validation
    if (!email || !password) {
      return fail(400, {
        error: "Email and password are required",
        email,
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        error: "Please enter a valid email address",
        email,
      });
    }

    // Password length validation
    if (password.length < 6) {
      return fail(400, {
        error: "Password must be at least 6 characters long",
        email,
      });
    }

    // TODO: Replace with your actual authentication logic
    // This is a placeholder - implement your actual login logic here
    try {
      // Example authentication check (replace with your actual logic)
      const isValidUser = await authenticateUser(email, password);

      if (!isValidUser) {
        return fail(401, {
          error: "Invalid email or password",
          email,
        });
      }

      // TODO: Set up session/cookies based on your auth system
      // Example: set session cookie, JWT token, etc.

      // If remember me is checked, extend session duration
      if (remember) {
        // TODO: Implement remember me functionality
        console.log("Remember me option selected");
      }

      // Redirect to dashboard or home page after successful login
      throw redirect(303, "/");
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, {
        error: "An error occurred during login. Please try again.",
        email,
      });
    }
  },
};

// Placeholder authentication function - replace with your actual implementation
async function authenticateUser(
  email: string,
  password: string
): Promise<boolean> {
  // TODO: Replace this with your actual authentication logic
  // This could involve:
  // - Checking against a database
  // - Validating against an external auth service
  // - Comparing hashed passwords
  // - etc.

  // For demonstration purposes, this is a simple check
  // In a real application, you would hash the password and compare with stored hash
  if (email === "test@example.com" && password === "password123") {
    return true;
  }

  return false;
}
