import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';

const schema = yup
  .object({
    fullName: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .required('Full name is required'),
    username: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers and underscores'
      )
      .required('Username is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      )
      .required('Password is required'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    // Handle complete profile logic here
    // Then navigate to dashboard or home
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-[url('/src/assets/img1.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">
            Complete Your Profile
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Please provide additional information to complete your profile
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
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
                Complete Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export { CompleteProfilePage };
