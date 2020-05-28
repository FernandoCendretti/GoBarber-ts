import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRespository';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository,
    ) {}

    public async excute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentRepository.findAllInDayFromProvider(
            {
                provider_id,
                day,
                month,
                year,
            },
        );

        const hourStart = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );
        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const hasAppointementInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            const compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available:
                    !hasAppointementInHour && isAfter(compareDate, currentDate),
            };
        });

        return availability;
    }
}

export default ListProviderDayAvailabilityService;
