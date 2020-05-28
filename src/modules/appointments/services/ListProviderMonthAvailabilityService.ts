import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRespository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMounthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository,
    ) {}

    public async excute({
        provider_id,
        month,
        year,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentRepository.findAllInMonthFromProvider(
            {
                provider_id,
                month,
                year,
            },
        );

        const numberOfDaysInMounth = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from(
            {
                length: numberOfDaysInMounth,
            },
            (_, index) => index + 1,
        );

        const availability = eachDayArray.map(day => {
            const appointmentInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                available: appointmentInDay.length < 10,
            };
        });

        return availability;
    }
}

export default ListProviderMounthAvailabilityService;
