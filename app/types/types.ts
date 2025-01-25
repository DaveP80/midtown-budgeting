export type User = {
  id?: string | number | null;
} | null;

export type UserContextType =
  | {
      user: User;
      setUser: (user: User) => void;
      clearUser: () => void;
    }
  | undefined;