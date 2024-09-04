'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import * as Yup from 'yup'
import {  useNavigate } from 'react-router-dom'
import { registerSchema } from '@/lib/validation'
import AnimatedBg from '@/components/AnimatedBg'
import { BACKEND_URL } from '../../config'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'

type RegisterFormValues = Yup.InferType<typeof registerSchema>

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      console.log('Form submitted:', data)
      const res = await axios.post(`${BACKEND_URL}/api/v1/register` , data)
      console.log(res.data)
      if(res.data?.message){
        const token  = res.data?.token
        window.localStorage.setItem('auth-token', token)
        toast({
          title: 'Registration successful',
        })
       navigate('/login')
      }
    }
     catch (error) {
      setSubmitError('An error occurred while submitting the form. Please try again.')
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
    <AnimatedBg/>
     <div className="relative z-10 flex h-full items-center justify-center p-4">
        <Card className="bg-white w-full max-w-md">
        <CardHeader>
            <CardTitle  className='text-center text-xl font-bold'>Register</CardTitle>
            <CardDescription className='text-center'>Create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
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
            <div className="space-y-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input id="confirm-password" type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
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
            <Button type="submit" className="w-full hover:bg-gray-200" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
            </CardFooter>
        </form>
        <div className='flex justify-center items-center p-4 font-semibold'>
            Already Have an Account ?
            <a href={"/"} className="text-blue-500 hover:underline ml-2 hover:text-blue-800"> Login </a> 
        </div>
        </Card>
    </div>
   </div>  
  )
}


