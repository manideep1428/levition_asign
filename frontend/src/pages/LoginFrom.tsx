import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { loginSchema } from '@/lib/validation'
import axios from 'axios'
import { BACKEND_URL } from "../../config"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent , CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type LoginFormValues = Yup.InferType<typeof loginSchema>;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {toast} = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      console.log('Form submitted:', data)
      const res =  await axios.post(` ${BACKEND_URL}/api/v1/login`, data)
      if(res.data.token){
        localStorage.setItem('auth-token', res.data.token)
        toast({
          title: 'Login successful',
          description: 'You have successfully logged in.',
        })
        window.location.href = '/stepper-form'
      }
    } catch (error) {
      setSubmitError('An error occurred while logging in. Please try again.')
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='h-screen w-full overflow-hidden'>
      <div className="relative z-10 flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className='text-center text-xl font-bold'>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              {submitError && (
                <Alert variant="destructive" className='text-red-500'>
                <AlertCircle  className="h-4 w-4 text-red-500" />
                <AlertTitle className='text-red-500'>Error</AlertTitle>
                <AlertDescription className='text-red-500'>{submitError}</AlertDescription>
                </Alert>
            )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full hover:bg-slate-100 hover:cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
          <div className='flex justify-center items-center p-4 font-semibold'>
            No Account ? Create One 
            <a href={"/register"} className="text-blue-500 hover:underline ml-2 hover:text-blue-800"> Register </a> 
          </div>
        </Card>
      </div>
    </div>
  )
}
