import { Router } from 'express';
import ensureAutheticated from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import ProviderController from '../controllers/ProviderController';

const providersRouter = Router();
const providersConreoller = new ProviderController();

providersRouter.use(ensureAutheticated);

providersRouter.get('/', providersConreoller.show);

export default providersRouter;
