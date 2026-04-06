import { User, UserPublic, UpdateUserInput } from "../../shared/types/all";
import { ApiError } from "../api/errors";
import { mockUsers } from "../mockData/users";

const MOCK_DELAY_MS = 50; //simulate network time, we obviously wont use this in the real service
function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

// Returns full User by ID
export async function getUserFullById(id: string): Promise<User | undefined> {
  await delay();
  return mockUsers.find((user) => user.id === id);
}

// Returns public profile — safe to call for any user
export async function getUserById(id: string): Promise<UserPublic | undefined> {
  await delay();
  const user = mockUsers.find((user) => user.id === id);
  if (!user) return undefined;
  const { email, firstName, lastName, location, ...publicFields } = user;
  return publicFields;
}

export async function getAllUsers(): Promise<UserPublic[]> {
  await delay();
  return mockUsers.map(({ email, firstName, lastName, location, ...publicFields }) => publicFields);
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  await delay();
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) throw new ApiError(404, `User ${id} not found`);
  mockUsers[index] = { ...mockUsers[index], ...input };
  return mockUsers[index];
}
