import Button from '@/components/Button';
import Input from '@/components/Input';
import useLoginController from './controller';
import { LoginRequestBody as LoginFormValues } from '@/services/types/request';

function Login() {
  const { control, onSubmit, formState, isLoading } = useLoginController();
  const { isValid, isDirty, errors } = formState;

  return (
    <div className="flex flex-grow flex-col items-center justify-start gap-12 py-5 md:justify-center md:gap-20">
      <div className="w-full text-center md:w-4/6">
        <h1 className="app-title text-center text-5xl font-bold md:text-6xl">
          Chat application
        </h1>
        <h2 className="mt-2 p-2 px-4 text-center text-sm font-semibold md:text-lg">
          Welcome to real time chat application
          <br />
          please fill your email and password to sign in
        </h2>
      </div>

      <form
        name="loginForm"
        noValidate
        className="flex w-full max-w-[240px] flex-col justify-center md:max-w-[360px]"
        onSubmit={onSubmit}
      >
        <div className="flex w-full flex-col">
          <Input<LoginFormValues>
            control={control}
            placeholder="Please enter your email"
            name="email"
            label="Email"
            rules={{
              required: true,
            }}
            className="w-full"
            autoFocus
          />
          <Input<LoginFormValues>
            control={control}
            placeholder="Please enter your password"
            type="password"
            name="password"
            label="Password"
            rules={{
              required: true,
            }}
          />

          <Button
            disabled={!isValid}
            className="mt-3 md:mt-4"
            type="submit"
            isLoading={isLoading}
          >
            Log in
          </Button>
          <p className="text-xxs m-1 pt-2 text-center text-rose-600 md:text-xs dark:text-rose-400">
            {isDirty && errors.root?.message}
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
