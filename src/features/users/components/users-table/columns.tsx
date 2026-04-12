'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { User } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { ROLE_OPTIONS } from './options';

export const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.name}</span>
        <span className='text-muted-foreground text-xs'>{row.original.email}</span>
      </div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search users...',
      variant: 'text' as const,
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'role',
    accessorKey: 'role',
    enableSorting: false,
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ cell }) => {
      const role = cell.getValue<string>() ?? 'user';
      return (
        <Badge variant='outline' className='capitalize'>
          {role}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'roles',
      variant: 'multiSelect' as const,
      options: ROLE_OPTIONS
    }
  },
  {
    id: 'status',
    accessorKey: 'banned',
    header: 'STATUS',
    cell: ({ row }) => {
      const banned = row.original.banned;
      return (
        <Badge variant={banned ? 'destructive' : 'default'}>{banned ? 'Banned' : 'Active'}</Badge>
      );
    }
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Joined' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return <span className='text-muted-foreground text-sm'>{date.toLocaleDateString()}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
