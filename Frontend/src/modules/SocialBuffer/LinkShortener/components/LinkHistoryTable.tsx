import React from 'react';
import { Table } from '@/shared/components/ui/Table';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';
interface LinkHistoryTableProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const LinkHistoryTable = ({ items = [] as unknown[] }) => (
  <Table />
    <TableHead />
      <TableRow />
        <TableCell as="th">URL</TableCell>
        <TableCell as="th">Clicks</TableCell></TableRow></TableHead>
    <TableBody />
      { (items || []).map((i: unknown) => (
        <TableRow key={i.id } />
          <TableCell className="truncate max-w-[300px]">{i.url}</TableCell>
          <TableCell>{i.clicks}</TableCell>
      </TableRow>
    </>
  ))}
      {items.length === 0 && (
        <TableRow />
          <TableCell colSpan={2} className="text-center text-gray-500 py-4">Sem histórico</TableCell>
      </TableRow>
    </>
  )}
    </TableBody>
  </Table>);

export default LinkHistoryTable;
