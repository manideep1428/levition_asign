import * as Yup from 'yup';
import * as z from 'zod';

const passwordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters long')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/\d/, 'Password must contain at least one digit')
  .matches(/[@#$%^&*()_+!~\-`=<>?{}[\]|]/, 'Password must contain at least one special character')
  .required('Password is required');

// Define the login schema
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: passwordSchema,
});


export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

export const addressSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Invalid phone number' }), // Adjust validation as needed
  street: z.string().min(1, { message: 'Street address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zip: z.string().max(6, { message: 'Invalid ZIP code' }),
  country: z.string().min(1, { message: 'Country is required' }),
});
