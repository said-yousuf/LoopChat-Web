import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email is required'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    navigate('/login/password', { state: { email: data.email } });
  };

  return (
    <div className="w-full min-h-screen bg-[url('/src/assets/img1.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Welcome back</h2>
          <p className="text-sm text-center text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid">
            <Button variant="outline" className="w-full">
              <FcGoogle className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={form.handleSubmit(onSubmit)}>
            Continue
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export { LoginPage };
