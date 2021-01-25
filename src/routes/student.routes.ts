import { Router } from 'express'
import {
  addGrade,
  addSubject,
  averageGrade,
  averageTotal
} from '../controllers/student.controller';

const router = Router();

router.post('/student/subject/:code', addSubject);
router.post('/student/grade/:code/:code_subject', addGrade);
router.get('/student/grade/average/:code/:code_subject', averageGrade);
router.get('/student/grade/average/:code', averageTotal);


export default router;