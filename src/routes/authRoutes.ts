import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

const router = Router();
const prisma = new PrismaClient();

//Generate a Random * digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

//endpoints

//Create a user if it doesnt exist
//generate the emailtoken and send to their email
router.post("/login", async (req, res) => {
  const { email } = req.body;

  //generate token
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "Email",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: { email },
          },
        },
      },
    });
    console.log(createdToken);

    //send email token to users email
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: "Couldnt start the authentication process" });
  }
});

//validate the emailToken
//Genrate a long lived jwt token
router.post("/authenticate", async (req, res) => {});

export default router;
