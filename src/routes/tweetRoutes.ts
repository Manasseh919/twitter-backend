import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

/* create tweet */
router.post("/", async (req, res) => {
  const { content, image, impression, userId } = req.body;
  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        impression,
        userId, // based on auth user
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Enter content" });
  }
});
/* list tweet */
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
    },
    
  });
  res.json(allTweets);
});

//get one tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
  });
  if (!tweet) {
    return res.status(404).json({ error: "Tweet not found" });
  }
  res.json(tweet);
});
//update tweet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;
  try {
    const result = await prisma.tweet.update({
      where: { id: Number(id) },
      data: {
        content,
        image,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: `failed to update tweet ${id}` });
  }
});
//delete tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({
    where: { id: Number(id) },
  });
  res.sendStatus(200);
});

export default router;
