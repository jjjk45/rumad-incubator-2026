import { User, UserPublic } from "../../shared/types/all.ts";
import { getUserFullById, getUserById, getAllUsers } from "../services/userService.ts";
import { ApiError } from "./errors.ts";

// Real backend equivalent: GET /me
export async function fetchMe(userId: string): Promise<User> {
  const user = await getUserFullById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

// Real backend equivalent: GET /users/:id
export async function fetchUserById(id: string): Promise<UserPublic> {
  const user = await getUserById(id);
  if (!user) throw new ApiError(404, `User ${id} not found`);
  return user;
}

// Real backend equivalent: GET /users
export async function fetchAllUsers(): Promise<UserPublic[]> {
  return getAllUsers();
}
