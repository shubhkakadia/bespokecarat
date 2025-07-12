import db from "../config/dbConfig";

// Base auth check
async function getUserFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("-")) return null;

  const token = authHeader;

  const session = await db.sessions.findOne({ where: { token } });
  if (!session) return null;

  return session;
}

// Role check helpers
export async function isMasterAdmin(req) {
  const session = await getUserFromToken(req);
  return session?.user_type === "master-admin";
}

export async function isAdmin(req) {
  const session = await getUserFromToken(req);
  return session && ["admin", "master-admin"].includes(session.user_type);
}

export async function isClient(req) {
  const session = await getUserFromToken(req);
  return session?.user_type === "client";
}
