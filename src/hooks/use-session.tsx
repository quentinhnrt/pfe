'use client';

import React, { createContext, useContext, useState } from 'react';

interface UserSafe {
  id: string;
  firstname?: string;
  image?: string;
}

interface SessionSafe {
  user: UserSafe | null;
}

const SessionContext = createContext<SessionSafe | null>(null);

export function useSession() {
  return useContext(SessionContext);
}

interface SessionProviderProps {
  children: React.ReactNode;
  initialSession: SessionSafe | null;
}

export function SessionProvider({ children, initialSession }: SessionProviderProps) {
  const [session] = useState<SessionSafe | null>(initialSession);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
