import { rowSelect, tableInsert } from "./myORM.js";

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

  const create = async (email: string, password: string) => {
    return await tableInsert("users", [
      { column: "email", value: email },
      { column: "password", value: password },
    ]);
  };

  return { getByEmail, getById, create };
}

export function Message() {
  // factory function with methods
}
