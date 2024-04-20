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
  const { control, formState, handleSubmit, setError } =
    useForm<LoginFormValues>({
      mode: 'onChange',
      defaultValues,
      resolver: zodResolver(schema),
    });

  const onSubmit = handleSubmit((formData: LoginFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      const { email, password } = formData;
      login({
        email,
        password,
      })
        .then(() => setIsLoading(false))
        .catch(() => {
          setIsLoading(false);
          setError('email', {
            type: 'validate',
          });
          setError('password', {
            type: 'validate',
          });
        });
    }, 200);
  });

  return { isLoading, control, formState, onSubmit };
}

export default useLoginController;
