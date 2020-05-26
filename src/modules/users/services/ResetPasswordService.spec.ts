import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let resetPassword: ResetPasswordService;
let fakeHash: FakeHashProvider;

describe('Reset Password', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeUserTokensRepository = new FakeUserTokenRepository();
        fakeHash = new FakeHashProvider();
        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHash,
        );
    });

    it('should be able to reset the password ', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHash, 'generateHash');

        await resetPassword.execute({
            token,
            password: '123123',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toBeCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-token',
        );

        await expect(
            resetPassword.execute({
                token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
