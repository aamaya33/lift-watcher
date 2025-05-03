import { Router, RequestHandler} from 'express';
import { PrismaClient } from '../generated/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.config';


const router = Router();
const prisma = new PrismaClient();

const registerHandler: RequestHandler = async (req, res) => {

    try {
        const { email, password, username } = req.body; 
        if (!email || !password || !username) {
            res.status(400).json({ 
              success: false, 
              message: 'Email and password are required' 
            });
            console.log("no email and password")
            return;
          }
        // check if the user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            res.status(400).json({ 
              success: false, 
              message: 'Email already exists' 
            });
            console.log("user already exists")
            return;
        }

        // hash password 
        const saltRounds = 12;
        const customSalt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, customSalt);  

        // create the new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        });
        
        // generate a JWT token
        const tokenPayload = { 
            id: newUser.id, 
            email: newUser.email,
            createdAt: new Date().toISOString()
          };
        
        const userToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            success: true,
            user: {
              id: newUser.id,
              email: newUser.email,
              username: newUser.username
            },
            token: userToken
          });
        console.log("User registered successfully:", newUser);

    } catch(error) {
        console.error('Error registering user:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
    }
};

const loginHandler: RequestHandler = async(req,res) => {
    try {
      const {email, password} = req.body; 
      console.log("Logging user in");

      if (!email || !password) {
        res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
        return;
      }

      // check to see if the user exists 
      const user = await prisma.user.findUnique({
        where: { email}
      })
      console.log("User found", user);

      if (!user) {
        res.status(400).json({ 
          success: false, 
          message: 'Email does not exist' 
        });
        return;
      }
      // check password
      const isPWValid = await bcrypt.compare(password, user.password);

      if (!isPWValid) {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid password' 
        });
        return;
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        createdAt: new Date().toISOString()
      };

      const userToken = jwt.sign(tokenPayload, JWT_SECRET, {expiresIn: '24h'});

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        },
        token: userToken
      });
    } catch(error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }   
};

router.post('/register', registerHandler);
router.post('/login', loginHandler);
export default router; 
