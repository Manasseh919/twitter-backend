import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { type } from "os";

const prisma = new PrismaClient();

const jWT_SECRET = "SUPER SECRET";

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  //authentication
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];
  if (!jwtToken) {
    return res.sendStatus(401);
  }

  //decode the jwt token
  try {
    const payload = (await jwt.verify(jwtToken, jWT_SECRET)) as {
      tokenId: number;
    };

    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: "API token nnot valid" });
    }

    req.user = dbToken.user;
  } catch (error) {
    return res.sendStatus(401);
  }
  next()
}

