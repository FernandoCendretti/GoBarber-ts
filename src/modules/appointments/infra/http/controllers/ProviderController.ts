import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProviderController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const listProviders = container.resolve(ListProvidersService);

        const providers = await listProviders.excute({
            user_id,
        });

        return response.json(providers);
    }
}

export default ProviderController;
