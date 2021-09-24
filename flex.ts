import axios from 'axios';
import dayjs from 'dayjs';

interface IFlexToken {
  accessToken: String,
  refreshToken: String,
}

interface IFlexTimeSchedule {
  range: IFlexTimeScheduleRange[],
  workType: string;
}

interface IFlexTimeScheduleRange {
  year: number;
  month: number;
  day: number;
  ampm: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export enum FlexCheckInStatus {
  BEFORE_CHECK_IN = 'BEFORE_CHECK_IN',
  WORKING = 'WORKING',
  AFTER_CHECK_OUT = 'AFTER_CHECK_OUT',
  UNKNOWN = 'UNKNOWN',
}

const DEFAULT_HEADER = {
  'Origin': 'https://flex.team',
};

export class Flex {
  userStatus: FlexCheckInStatus = FlexCheckInStatus.UNKNOWN;
  constructor(
    private readonly username: String,
    private readonly password: String,
  ) {}

  // async process with initializing Flex instance
  public static createNew = async (username: String, password: String): Promise<Flex> => {
    const flex = new Flex(username, password);
    await flex.userCheckInCheck();
    return flex;
  }

  private async login(): Promise<IFlexToken> {
    try {
      const request = await axios.post('https://amen.flex.team/actions/login', {
        email: this.username,
        password: this.password,
        code: '',
      }, {
        headers: DEFAULT_HEADER,
      });

      return {
        accessToken: request.data.credentials.accessToken,
        refreshToken: request.data.credentials.refreshToken,
      };
    } catch (error) {
      throw new FlexError('Authentication Error');
    }
  }

  private async userCheckInCheck(): Promise<void> {
    const userTokenInfo = await this.login();
    try {
      const request = await axios.get(`https://amen.flex.team/actions/api/v1/users/me/work-check-in-out?date=${dayjs(new Date()).format('YYYY-MM-DD')}`, {
        headers: {
          ...DEFAULT_HEADER,
          'x-flex-aid': userTokenInfo.accessToken,
          'x-flex-rid': userTokenInfo.refreshToken,
        },
      });
      
      this.userStatus = request.data.data.status;
    } catch (error) {
      throw new FlexError('User Status Check Error');
    }
  }

  public async checkIn(): Promise<void> {
    const userTokenInfo = await this.login();
    try {
      await axios.post('https://amen.flex.team/actions/api/v1/users/me/work-check-in', {
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        onTime: false,
        minutesDiff: 0,
        dryRun: false,
        dayWorkBlockOption: {
          restMinutes: 60,
        },
      }, {
        headers: {
          ...DEFAULT_HEADER,
          'x-flex-aid': userTokenInfo.accessToken,
          'x-flex-rid': userTokenInfo.refreshToken,
        },
      });
    } catch (error) {
      throw new FlexError('Check In Error');
    }
  }

  public async checkOut(): Promise<void> {
    const userTokenInfo = await this.login();
    try {
      await axios.post('https://amen.flex.team/actions/api/v1/users/me/work-check-out', {
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        onTime: false,
        minutesDiff: 0,
        dryRun: false,
        dayWorkBlockOption: {
          restMinutes: 60,
        },
      }, {
        headers: {
          ...DEFAULT_HEADER,
          'x-flex-aid': userTokenInfo.accessToken,
          'x-flex-rid': userTokenInfo.refreshToken,
        },
      });
    } catch (error) {
      throw new FlexError('Check Out Error');
    }
  }

  public async getTodayWorkPlan(): Promise<IFlexTimeScheduleRange[]> {
    const userTokenInfo = await this.login();
    try {
      const request = await axios.get('https://amen.flex.team/actions/time-tracking/schedule/now', {
        headers: {
          ...DEFAULT_HEADER,
          'x-flex-aid': userTokenInfo.accessToken,
          'x-flex-rid': userTokenInfo.refreshToken,
        },
      });

      const response = request.data;
      const today = dayjs(new Date()).format('YYYY-MM-DD');
      const todayIndex = this.dayjsDayConverter(dayjs(new Date()).day());

      if (!response.modifiableDates.includes(today)) {
        throw new FlexError('Today work plan is not modifiable.');
      }

      if (!response.data[todayIndex].isTargetWorkingDay) {
        throw new FlexError('Today is not woring day.');
      }

      const timeSchedules: IFlexTimeSchedule[] = response.data[todayIndex].timeSchedules;

      if (timeSchedules.length === 0) {
        throw new FlexError('Schedule must be registered. You can register work or time-off plan on your desktop.');
      }

      const workSchedule = timeSchedules.filter(schedule => schedule.workType !== 'TIME_OFF');

      if (workSchedule.length === 0) {
        throw new FlexError('Go to home and take some rest!');
      }

      if (workSchedule.length > 1) {
        throw new FlexError('Two work plans in a day is not allowed.')
      }

      return workSchedule[0].range;
    } catch (error) {
      console.log(error);
      throw new FlexError('Work Plan Retrieve Error');
    }
  }

  // Make return 0 on Monday
  private dayjsDayConverter(day: number): number {
    if (day === 0) return 6;
    else return day - 1;
  }
}

class FlexError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'FlexError';
  }
}
