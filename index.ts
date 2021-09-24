import { Flex, FlexCheckInStatus } from './flex';
import * as dotenv from 'dotenv';
import * as schedule from 'node-schedule';
dotenv.config();

const username = process.env.USERNAME as string;
const password = process.env.PASSWORD as string;

(async () => {
  try {
    const FlexInstance = await Flex.createNew(username, password);
    const { userStatus } = FlexInstance;
    console.log(userStatus);
    const workSchedule = await FlexInstance.getTodayWorkPlan();
    console.log(workSchedule);
  } catch (error) {
    console.log(error);
  }
})();

// // CHECK_IN
// schedule.scheduleJob(process.env.CHECKIN_CRON_RULE as string, async () => {
//   try {
//     const FlexInstance = await Flex.createNew(username, password);
//     const { userStatus } = FlexInstance;
//     if (userStatus === FlexCheckInStatus.BEFORE_CHECK_IN) await FlexInstance.checkIn();
//   } catch (error) {
//     console.log(error);
//   }
// });

// // CHECK_OUT
// schedule.scheduleJob(process.env.CHECKOUT_CRON_RULE as string, async () => {
//   try {
//     const FlexInstance = await Flex.createNew(username, password);
//     const { userStatus } = FlexInstance;
//     if (userStatus === FlexCheckInStatus.WORKING) await FlexInstance.checkOut();
//   } catch (error) {
//     console.log(error);
//   }
// });
