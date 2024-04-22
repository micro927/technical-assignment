import { ZodRawShape, z } from 'zod';

//NOTE: add new validation schema here
const schemas = {
  email: z
    .string()
    .email('You must enter a valid email')
    .min(1, 'You must enter an email'),
  password: z
    .string()
    .min(4, 'Password is too short - must be at least 4 chars.')
    .min(1, 'Please enter your password.'),
  search: z.string().min(1, 'Please enter your search data.').max(80),
};

export const createZodObjectSchema = (
  ...validateKeys: (keyof typeof schemas)[]
) => {
  const thisFromValidate: ZodRawShape = {};
  validateKeys.map((key) => (thisFromValidate[key] = schemas[key]));

  return z.object(thisFromValidate);
};
