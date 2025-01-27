import { createContext, useState } from "react";
import type { User, UserContextType } from "~/types/types";

export const GlobalContext = createContext<UserContextType>(undefined);

export default function GlobalContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User>(null);
    const [rowId, setRowId] = useState(-1);
    const clearUser = () => setUser({ id: null });
    return (
        <GlobalContext.Provider
            value={{ user, setUser, clearUser, rowId, setRowId }}
        >
            {children}
        </GlobalContext.Provider>
    );
}