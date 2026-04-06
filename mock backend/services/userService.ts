import { User, UserPublic } from "../../shared/types/all.ts";
import { mockUsers } from "../mockData/users.ts";

const MOCK_DELAY_MS = 50; //simulate network time, we obviously wont use this in the real service
async function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
} //just for mocking

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
