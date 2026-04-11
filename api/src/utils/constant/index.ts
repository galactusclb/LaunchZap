import { RoleList } from "./role";

export const constants = {
  NODE_ENV: process.env.NODE_ENV === 'production',
  auth: {
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
  },
  message: {
    validation: {
      required: 'This field is required',
      emailInvalid: 'Please enter a valid email',
      nameTooShort: 'Name must be at least 2 characters',
    }
  },
  role: RoleList
}
