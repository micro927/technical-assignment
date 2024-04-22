import { AuthenticationContext } from '@/core/authentication/Context';
import { LoginRequestBody as LoginFormValues } from '@/services/types/request';
import { createZodObjectSchema } from '@/utils/formValidators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

function useLoginController() {
  const { login } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);

  const schema = createZodObjectSchema('email', 'password');
  const defaultValues: LoginFormValues = {
    email: '',
    password: '',
  };
  const { control, handleSubmit, setError, formState } =
    useForm<LoginFormValues>({
      mode: 'onChange',
      defaultValues,
      resolver: zodResolver(schema),
    });

  const onSubmit = handleSubmit((formData: LoginFormValues) => {
    setIsLoading(true);
    const { email, password } = formData;
    login({
      email,
      password,
    })
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        setError('root', {
          type: 'validate',
          message: 'Login failed, please try again.',
        });
      });
  });

  return { isLoading, control, onSubmit, formState };
}

export default useLoginController;
