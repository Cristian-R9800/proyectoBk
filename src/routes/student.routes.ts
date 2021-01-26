import { Router } from 'express'
import {
  addGrade,
  addSubject,
  averageGrade,
  averageTotal,
  getGradesSubjectsbyCode
} from '../controllers/student.controller';

const router = Router();

router.post('/student/subject/:code', addSubject);
router.post('/student/grade/:code/:code_subject', addGrade);
router.get('/student/grade/average/:code/:code_subject', averageGrade);
router.get('/student/grade/average/:code', averageTotal);
router.get('/student/grade/:code/:code_subject', getGradesSubjectsbyCode);


export default router;