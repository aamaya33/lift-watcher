import { Router} from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.config';


const router = Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body; 

        if (!email || !password) {
            return res.status(400).json({ 
              success: false, 
              message: 'Email and password are required' 
            });
          }

        // check if the user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return res.status(400).json({ 
              success: false, 
              message: 'Email already exists' 
            });
        }

        // hash password 
        const saltRounds = 12;
        const customSalt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, saltRounds); // 10 rounds of salting or something idk 

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

        return res.status(201).json({
            success: true,
            user: {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name
            },
            token: userToken
          });
    } catch(error) {

        console.error('Error registering user:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
    }
})

export default router; 