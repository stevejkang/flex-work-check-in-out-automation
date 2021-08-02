import axios from 'axios';
import dayjs from 'dayjs';

interface IFlexToken {
  accessToken: String,
  refreshToken: String,
}

enum FlexCheckInStatus {
  BEFORE_CHECK_IN = 'BEFORE_CHECK_IN',
  WORKING = 'WORKING',
  AFTER_CHECK_OUT = 'AFTER_CHECK_OUT',
  UNKNOWN = 'UNKNOWN',
}

const DEFAULT_HEADER = {
  'Origin': 'https://flex.team',
};

class Flex {
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
      }
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
        }
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
}

class FlexError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'FlexError';
  }
}

export default Flex;
