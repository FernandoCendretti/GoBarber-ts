import ICreateUserDTO from '../dtos/ICreateUsersDTO';
import User from '../infra/typeorm/entities/User';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidresDTO';

export default interface IUserRepository {
    findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(datas: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
}
