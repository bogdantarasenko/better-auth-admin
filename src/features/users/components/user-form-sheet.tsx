'use client';

import { useState } from 'react';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { useMutation } from '@tanstack/react-query';
import { createUserMutation } from '../api/mutations';
import { toast } from 'sonner';
import * as z from 'zod';
import { userSchema, type UserFormValues } from '../schemas/user';
import { ROLE_OPTIONS } from './users-table/options';

interface UserFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormSheet({ open, onOpenChange }: UserFormSheetProps) {
  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: () => {
      toast.success('User created successfully');
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error('Failed to create user')
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user'
    } as UserFormValues,
    validators: {
      onSubmit: userSchema
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value);
    }
  });

  const { FormTextField, FormSelectField } = useFormFields<UserFormValues>();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>New User</SheetTitle>
          <SheetDescription>Fill in the details to create a new user.</SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-auto'>
          <form.AppForm>
            <form.Form id='user-form-sheet' className='space-y-4'>
              <FormTextField
                name='name'
                label='Name'
                required
                placeholder='John Doe'
                validators={{
                  onBlur: z.string().min(2, 'Name must be at least 2 characters')
                }}
              />

              <FormTextField
                name='email'
                label='Email'
                required
                type='email'
                placeholder='john@example.com'
                validators={{
                  onBlur: z.string().email('Please enter a valid email')
                }}
              />

              <FormTextField
                name='password'
                label='Password'
                required
                type='password'
                placeholder='Min. 8 characters'
                validators={{
                  onBlur: z.string().min(8, 'Password must be at least 8 characters')
                }}
              />

              <FormSelectField
                name='role'
                label='Role'
                required
                options={ROLE_OPTIONS}
                placeholder='Select role'
                validators={{
                  onBlur: z.string().min(1, 'Please select a role')
                }}
              />
            </form.Form>
          </form.AppForm>
        </div>

        <SheetFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='user-form-sheet' isLoading={createMutation.isPending}>
            <Icons.check /> Create User
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function UserFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' /> Add User
      </Button>
      <UserFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
