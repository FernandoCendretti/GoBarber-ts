import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUserRepository;
let showProfile: ShowProfileService;
describe('Update Profile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to update the profile ', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jonh Doe',
            email: 'jonhdoe@example.com',
            password: '123123',
        });

        const showUser = await showProfile.excute({ user_id: user.id });

        expect(showUser).toHaveProperty('id');
        expect(showUser.name).toBe('Jonh Doe');
        expect(showUser.email).toBe('jonhdoe@example.com');
    });

    it('should not be able to update the profile with user not exists', async () => {
        await expect(
            showProfile.excute({ user_id: 'non-existing' }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
