import { expect } from 'chai';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

let response: AxiosResponse;

describe('Check login api health', () => {
  before(async () => {
    response = await axios.post('https://amen.flex.team/actions/login', {
      email: process.env.USERNAME,
      password: process.env.PASSWORD,
      code: '',
    }, {
      headers: {
        'Origin': 'https://flex.team',
      },
    });
  });
  it('should return 200', async () => {
    expect(response.status).to.equal(200);
  });
  it('should return access and refresh token', async () => {
    expect(response.data.credentials.accessToken).to.not.be.undefined;
    expect(response.data.credentials.refreshToken).to.not.be.undefined;
  });
});
