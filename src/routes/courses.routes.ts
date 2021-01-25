import {Router} from 'express'
import {
    getSubjectStudents
} from '../controllers/course.controller';

const router = Router();

router.get('/course/students/:code_subject', getSubjectStudents);



export default router;