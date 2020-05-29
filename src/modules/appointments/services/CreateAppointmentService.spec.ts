import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('Create Appointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to create appointment', async () => {
        /**
         * Pode ser que bugue outros testes, caso isso aconteça,
         * mudar o mock para implementationOnce
         */
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 11).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 12),
            user_id: 'user_id',
            provider_id: 'provider_id',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider_id');
    });

    it('should not be able to create two appointment in same time', async () => {
        const appointmentDate = new Date(2020, 4, 10, 12);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: 'user_id',
            provider_id: 'provider_id',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: 'user_id',
                provider_id: 'provider_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 10),
                user_id: 'user_id',
                provider_id: 'provider_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider ', async () => {
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: 'user_id',
                provider_id: 'user_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am and after 5pm', async () => {
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 18),
                user_id: 'user_id',
                provider_id: 'provider_id',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 7),
                user_id: 'user_id',
                provider_id: 'provider_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
