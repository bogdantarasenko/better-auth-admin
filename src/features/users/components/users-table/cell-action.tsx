'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deleteUserMutation, banUserMutation, unbanUserMutation } from '../../api/mutations';
import type { User } from '../../api/types';
import { Icons } from '@/components/icons';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CellActionProps {
  data: User;
}

export function CellAction({ data }: CellActionProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    ...deleteUserMutation,
    onSuccess: () => {
      toast.success('User deleted successfully');
      setDeleteOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  const banMutation = useMutation({
    ...banUserMutation,
    onSuccess: () => {
      toast.success('User banned successfully');
    },
    onError: () => {
      toast.error('Failed to ban user');
    }
  });

  const unbanMutation = useMutation({
    ...unbanUserMutation,
    onSuccess: () => {
      toast.success('User unbanned successfully');
    },
    onError: () => {
      toast.error('Failed to unban user');
    }
  });

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(data.id)}
        loading={deleteMutation.isPending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <Icons.ellipsis className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {data.banned ? (
            <DropdownMenuItem
              onClick={() => unbanMutation.mutate(data.id)}
              disabled={unbanMutation.isPending}
            >
              <Icons.check className='mr-2 h-4 w-4' /> Unban
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => banMutation.mutate({ id: data.id })}
              disabled={banMutation.isPending}
            >
              <Icons.close className='mr-2 h-4 w-4' /> Ban
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Icons.trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
