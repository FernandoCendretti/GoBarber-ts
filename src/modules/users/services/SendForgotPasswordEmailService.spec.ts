import AppError from '@shared/errors/AppError';
import FakeEmailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUserRepository;
let fakeEmailProvider: FakeEmailProvider;
let fakeUserTokensRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('Send Forgot Password Email', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeEmailProvider = new FakeEmailProvider();
        fakeUserTokensRepository = new FakeUserTokenRepository();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeEmailProvider,
            fakeUserTokensRepository,
        );
    });

    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'johndoe@example.com',
            password: '123123',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should genarate forgot password token', async () => {
        const genarateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'johndoe@example.com',
            password: '123123',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        expect(genarateToken).toHaveBeenCalledWith(user.id);
    });
});
