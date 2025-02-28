import { rowSelect, tableInsert, updateColumns } from "./myORM.js";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  admin: boolean;
}

export function User() {
  const USERS_TABLE = "users";

  const getByEmail = async (email: string): Promise<User> => {
    return await rowSelect(USERS_TABLE, { column: "email", equals: email });
  };

  const getById = async (id: number): Promise<User> => {
    return await rowSelect(USERS_TABLE, { column: "id", equals: id });
  };

  const create = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => {
    return await tableInsert(USERS_TABLE, [
      { column: "first_name", value: firstname },
      { column: "last_name", value: lastname },
      { column: "email", value: email },
      { column: "password", value: password },
      { column: "member", value: false },
      { column: "admin", value: false },
    ]);
  };

  const makeMember = async (userId: number) => {
    return await updateColumns(
      USERS_TABLE,
      [{ column: "member", value: true }],
      userId
    );
  };

  const makeAdmin = async (userId: number) => {
    return await updateColumns(
      USERS_TABLE,
      [{ column: "admin", value: true }],
      userId
    );
  };

  return { getByEmail, getById, create, makeMember, makeAdmin };
}

export function Message() {
  // factory function with methods
}
