import { rowSelect } from "./myORM.js";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  admin: boolean;
}

export function User() {
  const getByEmail = async (email: string): Promise<User> => {
    return await rowSelect("users", { column: "email", equals: email });
  };

  const getById = async (id: number): Promise<User> => {
    return await rowSelect("users", { column: "id", equals: id });
  };

  return { getByEmail, getById };
}

export function Message() {
  // factory function with methods
}
