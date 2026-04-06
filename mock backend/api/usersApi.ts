import { User, UserPublic, UpdateUserInput } from "../../shared/types/all.ts";
import { getUserFullById, getUserById, getAllUsers, updateUser } from "../services/userService.ts";
import { ApiError } from "./errors.ts";
import { mockAuth } from "../services/mockAuth.ts";

// GET /me
export async function fetchMe(): Promise<User> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  const user = await getUserFullById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

// GET /users/:id
export async function fetchUserById(id: string): Promise<UserPublic> {
  const user = await getUserById(id);
  if (!user) throw new ApiError(404, `User ${id} not found`);
  return user;
}

// GET /users
export async function fetchAllUsers(): Promise<UserPublic[]> {
  return getAllUsers();
}

// PATCH /me
export async function patchMe(input: UpdateUserInput): Promise<User> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return updateUser(userId, input);
}
