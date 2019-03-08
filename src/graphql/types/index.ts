/* tslint:disable */

export type Timestamp = any;

export interface Query {
  me?: Me | null;
}

export interface Me {
  id: string;
  email?: string | null;
  sessionToken?: string | null;
  sessionStartedAt?: Timestamp | null;
  sessionExpiresAt?: Timestamp | null;
}

export interface Mutation {
  authenticateMe?: Me | null;
  invalidateMe: boolean;
}

export interface AuthenticateMeInput {
  email: string;
  passw: string;
}
export interface AuthenticateMeMutationArgs {
  input: AuthenticateMeInput;
}
