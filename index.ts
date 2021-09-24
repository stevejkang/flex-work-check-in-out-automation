import { Flex, FlexCheckInStatus } from './flex';
import * as dotenv from 'dotenv';
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
