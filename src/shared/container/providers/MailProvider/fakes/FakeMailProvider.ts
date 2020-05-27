import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

export default class FakeEmailProvider implements IMailProvider {
    private message: ISendMailDTO[] = [];

    public async sendMail(message: ISendMailDTO): Promise<void> {
        this.message.push(message);
    }
}
