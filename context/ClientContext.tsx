"use client";

import React, { createContext, useContext, useState } from "react";
import type { Client } from "@/types/client";

type ClientContextType = {
  client: Client | null;
  setClient: (c: Client | null) => void;
};

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({
  children,
  initialClient,
}: {
  children: React.ReactNode;
  initialClient: Client | null;
}) {
  const [client, setClient] = useState<Client | null>(initialClient);

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used inside ClientProvider");
  return ctx;
}
