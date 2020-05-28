import AppError from '@shared/errors/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUserRepository;
let listProviders: ListProvidersService;
describe('List Providers', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();

        listProviders = new ListProvidersService(fakeUsersRepository);
    });

    it('should be able to list the providers ', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'Jonh Doe',
            email: 'jonhdoe@example.com',
            password: '123123',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Jonh Tre',
            email: 'jonhtre@example.com',
            password: '123123',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Jonh Qua',
            email: 'jonhqua@example.com',
            password: '123123',
        });

        const providers = await listProviders.excute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
