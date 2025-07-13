
import { PrismaClient, Exercise, Workout  } from '../generated/client';
import workoutsRouter from '../routes/workouts';

export interface CreateExerciseData {
    videoUri?: string;
    liftType: string;
    weight: number;
    variation: string;
    sets: number;
    reps: number;
    notes?: string;
    userId: number;
    workoutId?: number;
}

export interface WorkoutData extends Workout{
    exercises: Exercise[]
}

export class WorkoutService {

    constructor(private prisma: PrismaClient());



}