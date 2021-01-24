import {Router} from 'express'
import {
  deleteUser,
  getUser,
  signIn,
  signUp,
  updateLocationUser,
  updateUser,
} from '../controllers/user.controller';

const router = Router();

router.post('/student/grade', signUp);



//


router.post('/signin', signIn);

export default router;