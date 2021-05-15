const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

class SendOtp {
  constructor() {
    console.log('SendOtp');
  }

  async sendOtp(number, channel = 'sms') {
    let otpSid;
    await client.verify.services(serviceSid)
      .verifications
      .create({ to: number, channel: channel })
      .then(verification => otpSid = verification.sid)
      .catch(e => { otpSid = e; });

    return otpSid;
  }

  async verifyOtp(number, code) {
    let otpVerify;
    await client.verify.services(serviceSid)
      .verificationChecks
      .create({ to: number, code: code })
      .then(verification_check => otpVerify = verification_check)
      .catch(e => { otpVerify = e; });

    return otpVerify;
  }

  async verifySid(verifySid) {
    let otpRes;
    await client.verify.services(serviceSid)
      .verifications(verifySid)
      .fetch()
      .then(verification => {
        otpRes = verification;
      })
      .catch(e => { console.log(e); otpRes = e; });
    return otpRes;
  }
}
export default SendOtp
