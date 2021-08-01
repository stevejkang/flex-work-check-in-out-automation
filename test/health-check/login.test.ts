import { expect } from 'chai';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const DEFAULT_HEADER = {
  'Origin': 'https://flex.team',
};

const postRequest = axios.post('https://amen.flex.team/actions/login', {
  email: process.env.USERNAME,
  password: process.env.PASSWORD,
  code: '',
}, {
  headers: DEFAULT_HEADER,
});

describe('Check login api health', () => {
  it('should return 200', async () => {
    const response = await postRequest;
    expect(response.status).to.equal(200);
  });
  it('should return access and refresh token', async () => {
    const response = await postRequest;
    expect(response.data.credentials.accessToken).to.not.be.empty;
    expect(response.data.credentials.refreshToken).to.not.be.empty;
  });
});