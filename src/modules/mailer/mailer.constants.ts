import { User } from '../user/user.schema';

export const registrationEmail = (user: User, token: string) => {
  return `<html>
            <body>
              <div>
                <p>Hi ${user.firstName}!</p>
                <p>You did it! You registered!, You're successfully registered.✔</p>
                <p>Please enter the otp below to verify your account:</p>
                <h3>${token}</h3>
              </div>
            </body>
          </html>
  `;
};

export const forgotPasswordEmail = (password: string) => {
  return `<html>
            <body>
              <div>
                <p>Request Reset Password Successfully!  ✔</p>
                <p>This is your new password: <b>${password}</b></p>
              </div>
            </body>
          </html>
  `;
};

export const changePasswordEmail = (user) => {
  return `<html>
            <body>
              <div>
                <p>Change Password Successfully! ✔ </p>
                <p>this is your new password: ${user.password}</p>
              </div>
            </body>
          </html>
  `;
};

export const otpEmail = (name: string, otp: string) => {
  return `<html>
            <body>
              <div>
                <p>Hi, ${name}! </p>
                <p>Please enter the otp below to verify your account:</p>
                <h3>${otp}</h3>
              </div>
            </body>
          </html>
  `;
};

export const forgotPasswordOtpEmail = (name: string, otp: string) => {
  return `<html>
            <body>
              <div>
                <p>Hi, ${name}! </p>
                <p>Please enter the otp below to reset your password:</p>
                <h3>${otp}</h3>
              </div>
            </body>
          </html>
  `;
};
