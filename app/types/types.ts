export type User = {
  id?: string | number | null;
  email?: string;
} | null;

export type UserContextType =
  | {
      user: User;
      setUser: (user: User) => void;
      clearUser: () => void;
      rowId: number;
      setRowId: (args: number) => void;
    }
  | undefined;