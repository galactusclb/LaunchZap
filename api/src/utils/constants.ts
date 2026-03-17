export const constants = {
  NODE_ENV: process.env.NODE_ENV === 'production',
  message: {
    validation: {
      required: 'This field is required',
      emailInvalid: 'Please enter a valid email',
      nameTooShort: 'Name must be at least 2 characters',
    }
  }
}
