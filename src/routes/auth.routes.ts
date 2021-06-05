import {Router} from 'express'
import {
  deleteUser,
  getUser,
  getUserSubjects,
  saveImage,
  sendSupport,
  signIn,
  signUp,
  updateUser,
} from '../controllers/user.controller';


const router = Router();

router.post('/perfil/usuario', signUp);
router.post('/perfil/saveIma', saveImage);
router.get('/perfil/usuario', getUser);
router.put('/perfil/usuario', updateUser);
router.delete('/perfil/usuario', deleteUser);
router.post('/perfil/usuario/signin', signIn);
router.get('/perfil/subjects/:code',getUserSubjects);
router.post('/perfil/sendEmail/', sendSupport);


//test


export default router;