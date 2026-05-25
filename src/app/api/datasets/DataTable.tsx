'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type RecordRow = Record<string, any>;

interface DataTableProps {
  slug: string;
}

export function DataTable({ slug }: DataTableProps) {
  const [data, setData] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/datasets/${slug}/records?page=${page}&limit=25`);
        const json = await res.json();
        if (res.ok) {
          setData(json.data);
          setTotalPages(json.pagination.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch dataset records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [slug, page]);

  // Dynamically infer columns from the first row keys
  const columns: ColumnDef<RecordRow>[] =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
        }))
      : [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading && data.length === 0) {
    return <Skeleton className="h-96 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  No records found for this dataset.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Page {page} of {totalPages} ({data.length} items shown)
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}