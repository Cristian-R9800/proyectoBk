import {Router} from 'express'
import {
    getSubjectStudents, getTeachers
} from '../controllers/course.controller';

const router = Router();

router.get('/course/students/:code_subject', getSubjectStudents);
router.get('/course/teacher/', getTeachers);


export default router;