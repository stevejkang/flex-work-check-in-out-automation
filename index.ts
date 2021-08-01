import Flex from './flex';
import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
  const username = process.env.USERNAME as string;
  const password = process.env.PASSWORD as string;

  try {
    const FlexInstance = await Flex.createNew(username, password);
    const { userStatus } = FlexInstance;
    console.log(userStatus);
  } catch (error) {
    console.log(error);
  }
})();
