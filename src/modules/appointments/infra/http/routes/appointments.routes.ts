import { Router } from 'express';
import ensureAutheticated from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import AppointmentsController from '../controllers/AppointmentController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAutheticated);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
