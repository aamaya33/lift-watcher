import { Router, RequestHandler} from 'express';
import { PrismaClient } from '../generated/client';

const router = Router();
const prisma = new PrismaClient();

const addExerciseHandler: RequestHandler = async (req, res) => {
    try {
        const {liftType, weight, variation, sets, reps, notes, userId} = req.body;

        if (!liftType || !weight || !variation || !sets || !reps) {
            res.status(400).json({ 
              success: false, 
              message: 'All fields are required' 
            });
            return;
          }
        if (!userId) {
            res.status(400).json({ 
              success: false, 
              message: 'User ID was not passed in' 
            });
            return;
          }
        
          // check if user exists 

          const existingUser = await prisma.user.findUnique({
            where: { id: userId}
          })

        if (!existingUser) {
            res.status(404).json({ 
            success: false, 
            message: 'User does not exist' 
            });
            return;
        }
        // create the new workout (for now we assume the user is inputting a workout for the day that they are submitting)
        const newExercise = await prisma.exercise.create({
            data: {
                liftType,
                weight,
                variation,
                sets,
                reps,
                notes,
            },    
        });

        console.log("New exercise created", newExercise);

        res.status(200).json({
            success: true,
            message: 'Exercise added successfully',
            exercise: newExercise,
        });
    } catch (error) {
        console.error('Error adding exercise:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

router.post('/addExercise', addExerciseHandler);

export default router;