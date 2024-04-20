import Button from '@/components/Button';
import Input from '@/components/Input';
import useLoginController from './controller';
import { LoginRequestBody as LoginFormValues } from '@/services/types/request';

function Login() {
  const { control, onSubmit } = useLoginController();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-red-400">
      <div>
        <h1 className="app-title text-5xl font-bold">Chat Application</h1>
      </div>
      <div>
        <h2>please login</h2>
        <form
          name="loginForm"
          noValidate
          className="mt-32 flex w-full flex-col justify-center"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-2">
            <Input<LoginFormValues>
              control={control}
              name="email"
              label="Email"
              rules={{
                required: true,
              }}
            />
            <Input<LoginFormValues>
              control={control}
              name="password"
              label="Password"
              rules={{
                required: true,
              }}
            />

            <Button type="submit">Log in</Button>
          </div>
        </form>
      </div>
      <hr />
    </div>
  );
}

export default Login;
