import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { setAddress } from '../features/AddressSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { addressSchema } from '@/lib/validation';
import { UploaderProps } from '@/components/FileUploader';
import axios from 'axios';
import { BACKEND_URL } from '../../config';

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressForm({onUploadSuccess}:UploaderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data: AddressFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      dispatch(setAddress(data));
      console.log('Form submitted:', data);
      const res = await axios.post(`${BACKEND_URL}/api/v1/form`, data , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('auth-token'),
        }
      });
      if (res.status === 200) {
        onUploadSuccess(true);
      }
    } catch (error) {
      setSubmitError('An error occurred while submitting the form. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
        <CardDescription>Please enter your complete address details</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="w-full">
            <Controller 
              name="phone"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country={'in'} 
                  value={value}
                  onChange={onChange}
                  enableSearch={true}
                />
              )}
            />
            </div>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input id="street" {...register('street')} />
            {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register('state')} />
              {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" {...register('zip')} />
                {errors.zip && <p className="text-sm text-red-500">{errors.zip.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="zip">Country</Label>
                <Input id="zip" {...register('country')} />
                {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
            </div>
          </div>
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className='text-red-500'>Error</AlertTitle>
              <AlertDescription className='text-red-500'>{submitError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
