export type Maybe<T> = T | null;

export interface UserInput {
  userId: string;
}

export interface UsersInput {
  limit?: Maybe<number>;

  after?: Maybe<number>;

  order?: Maybe<string>;

  query?: Maybe<string>;
}

export interface AuthenticateUserInput {
  email: string;

  passw: string;
}

export type Timestamp = any;

export type Upload = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  user?: Maybe<User>;

  users: User[];
}

export interface User {
  id: string;

  role: string;

  firstname: string;

  lastname: string;

  phone: string;

  email: string;

  image?: Maybe<string>;
  /** Metas */
  createdAt: Timestamp;

  updatedAt: Timestamp;
}

export interface Mutation {
  authenticateUser?: Maybe<Session>;
}

export interface Session {
  token: string;

  startedAt: Timestamp;

  expiresAt: Timestamp;

  user: User;
}

// ====================================================
// Arguments
// ====================================================

export interface UserQueryArgs {
  input: UserInput;
}
export interface UsersQueryArgs {
  input: UsersInput;
}
export interface AuthenticateUserMutationArgs {
  input?: Maybe<AuthenticateUserInput>;
}
