export type SessionContext = {
  role: "anonymous" | "member";
  sessionId: string | null;
};

export type AppBindings = {
  Variables: {
    requestId: string;
    session: SessionContext;
  };
};
