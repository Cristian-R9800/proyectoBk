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

router.post('/perfil/usuario', signUp);
router.get('/perfil/usuario', getUser);
router.put('/perfil/usuario', updateUser);
router.delete('/perfil/usuario', deleteUser);
router.post('/perfil/usuario/location', updateLocationUser);


//


router.post('/signin', signIn);

export default router;