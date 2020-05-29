import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersDayAvalabillity: ListProviderDayAvailabilityService;
describe('List Providers Mounth Avalability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProvidersDayAvalabillity = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list an hour availability from provider ', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '12345',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '12345',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime();
        });

        const avalability = await listProvidersDayAvalabillity.excute({
            provider_id: 'user',
            day: 20,
            year: 2020,
            month: 5,
        });

        expect(avalability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
                { hour: 17, available: true },
            ]),
        );
    });
});
