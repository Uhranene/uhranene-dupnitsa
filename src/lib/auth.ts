import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-only-insecure-secret-change-me"
);

const PARENT_COOKIE = "uhd_parent_session";
const SESSION_DAYS = 30;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

type SessionPayload = {
  sub: string;
  role: "parent";
};

async function sign(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(SECRET);
}

async function verify(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (typeof payload.sub === "string" && payload.role === "parent") {
      return { sub: payload.sub, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createParentSession(parentId: string) {
  const token = await sign({ sub: parentId, role: "parent" });
  const store = await cookies();
  store.set(PARENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getParentId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(PARENT_COOKIE)?.value;
  if (!token) return null;
  const payload = await verify(token);
  return payload?.role === "parent" ? payload.sub : null;
}

export async function clearParentSession() {
  const store = await cookies();
  store.delete(PARENT_COOKIE);
}

export { PARENT_COOKIE };
