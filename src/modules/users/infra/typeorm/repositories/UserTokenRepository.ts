import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokenRepository {
    private ormRespository: Repository<UserToken>;

    constructor() {
        this.ormRespository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRespository.findOne({
            where: { token },
        });

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRespository.create({
            user_id,
        });

        await this.ormRespository.save(userToken);

        return userToken;
    }
}

export default UserTokensRepository;
