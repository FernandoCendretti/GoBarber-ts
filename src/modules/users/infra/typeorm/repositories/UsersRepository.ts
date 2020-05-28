import { getRepository, Repository, Not } from 'typeorm';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUsersDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidresDTO';
import User from '../entities/User';

class UsersRepository implements IUserRepository {
    private ormRespository: Repository<User>;

    constructor() {
        this.ormRespository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRespository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRespository.findOne({ where: { email } });

        return user;
    }

    public async findAllProviders({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];

        if (except_user_id) {
            users = await this.ormRespository.find({
                where: {
                    id: Not(except_user_id),
                },
            });
        } else {
            users = await this.ormRespository.find();
        }

        return users;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRespository.create(userData);

        await this.ormRespository.save(user);

        delete user.password;

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRespository.save(user);
    }
}

export default UsersRepository;
