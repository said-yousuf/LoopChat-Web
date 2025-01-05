import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/services/auth-service';
import { socketService } from '@/services/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export function LoginPasswordPage() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect back to login if no email
  // useEffect(() => {
  //   if (!email) {
  //     console.log('No email found, redirecting to login');
  //     navigate('/login');
  //   }
  // }, [email, navigate]);

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: email || '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);
      const response = await login(data);
      setAuth(response.token);
      socketService.connect(response.token);
      navigate('/main');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[url('/src/assets/img1.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Sign in</h2>
          <p className="text-sm text-center text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
