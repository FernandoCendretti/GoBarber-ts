import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import IUserRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokenRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('UserToken does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user) {
            throw new AppError('User does not exists');
        }

        const tokenCreatedAt = userToken.created_at;

        const compareDate = addHours(tokenCreatedAt, 2);

        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token Expired');
        }
        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
