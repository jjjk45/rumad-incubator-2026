// Simulates an auth session for the mock backend
// In production this is replaced by reading the verified user ID from the auth token server-side

let currentUserId: string | null = null;

export const mockAuth = {
  login(userId: string) {
    currentUserId = userId;
  },
  logout() {
    currentUserId = null;
  },
  getId(): string | null {
    return currentUserId;
  },
};
