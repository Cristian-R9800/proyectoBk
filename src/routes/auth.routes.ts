import {Router} from 'express'
import {
  deleteUser,
  getUser,
  getUserSubjects,
  signIn,
  signUp,
  updateUser,
} from '../controllers/user.controller';

const router = Router();

router.post('/perfil/usuario', signUp);
router.get('/perfil/usuario', getUser);
router.put('/perfil/usuario', updateUser);
router.delete('/perfil/usuario', deleteUser);
router.post('/perfil/usuario/signin', signIn);
router.get('/perfil/subjects/:code',getUserSubjects);

export default router;