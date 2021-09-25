import { Flex, FlexCheckInStatus } from './flex';
import * as dotenv from 'dotenv';
import dayjs from 'dayjs';
dotenv.config();

const username = process.env.USERNAME as string;
const password = process.env.PASSWORD as string;

// run each 5min
(async () => {
  try {
    const FlexInstance = await Flex.createNew(username, password);
    const { userStatus } = FlexInstance;
    const workSchedule = await FlexInstance.getTodayWorkPlan();

    const now = dayjs(new Date());
    const nowDate = now.format('YYYY-MM-DD');

    const [workStart, workEnd] = workSchedule;
    const convertedWorkStartHour = workStart.ampm === 'am' ? Number(workStart.hours) : Number(workStart.hours) + 12;
    const convertedWorkStartMinute = Number(workStart.minutes);
    const convertedWorkEndHour = workEnd.ampm === 'am' ? Number(workEnd.hours) : Number(workEnd.hours) + 12;
    const convertedWorkEndMinute = Number(workEnd.minutes);

    const workStartDatetime = dayjs(new Date(`${nowDate} ${convertedWorkStartHour}:${convertedWorkStartMinute}:00`));
    const workEndDatetime = dayjs(new Date(`${nowDate} ${convertedWorkEndHour}:${convertedWorkEndMinute}:00`));

    if (userStatus === FlexCheckInStatus.BEFORE_CHECK_IN && now.add(10, 'minute').isAfter(workStartDatetime)) {
      await FlexInstance.checkIn();
    } else if (userStatus === FlexCheckInStatus.WORKING && now.isAfter(workEndDatetime)) {
      await FlexInstance.checkOut();
    }
  } catch (error) {
    console.log(error);
  }
})();
