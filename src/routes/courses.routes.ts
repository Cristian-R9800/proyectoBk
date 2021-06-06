import {Router} from 'express'
import {
    getSubjectsByCode,
    getSubjectStudents, getTeachers
} from '../controllers/course.controller';

const router = Router();

router.get('/course/students/:code_subject', getSubjectStudents);
router.get('/course/teacher/', getTeachers);
router.get('/course/student/subjects/:code', getSubjectsByCode);


export default router;