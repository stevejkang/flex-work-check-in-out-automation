import axios from 'axios';

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
  }

  private async userCheckInCheck(): Promise<void> {
    const userTokenInfo = await this.login();
    const request = await axios.get('https://amen.flex.team/actions/api/v1/users/me/work-check-in-out?date=2021-07-26', { // TODO: Set to current date
      headers: {
        ...DEFAULT_HEADER,
        'x-flex-aid': userTokenInfo.accessToken,
        'x-flex-rid': userTokenInfo.refreshToken,
      }
    });
    
    this.userStatus = request.data.data.status;
  }
}

export default Flex;
