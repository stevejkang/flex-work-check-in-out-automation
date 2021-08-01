import { expect } from 'chai';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const postRequest = axios.post('https://amen.flex.team/actions/login', {
  email: process.env.USERNAME,
  password: process.env.PASSWORD,
  code: '',
}, {
  headers: {
    'Origin': 'https://flex.team',
  },
});

describe('Check login api health', () => {
  it('should return 200', async () => {
    const response = await postRequest;
    expect(response.status).to.equal(200);
  });
  it('should return access and refresh token', async () => {
    const response = await postRequest;
    expect(response.data.credentials.accessToken).to.not.be.undefined;
    expect(response.data.credentials.refreshToken).to.not.be.undefined;
  });
});