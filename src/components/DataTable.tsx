import { useMemo, useState, useCallback, KeyboardEvent, ReactNode } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<Row> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: string;
  render?: (row: Row) => ReactNode;
  sortValue?: (row: Row) => string | number | Date | null | undefined;
  ariaLabel?: (row: Row) => string;
}

export interface DataTableProps<Row> {
  caption: string;
  captionHidden?: boolean;
  summary?: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  emptyMessage?: string;
  loading?: boolean;
  initialSort?: { key: string; direction: SortDirection };
  onRowActivate?: (row: Row) => void;
  rowLabel?: (row: Row) => string;
}

const alignClass = (align?: 'left' | 'right' | 'center') =>
  align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

export default function DataTable<Row>({
  caption,
  captionHidden = false,
  summary,
  columns,
  rows,
  rowKey,
  emptyMessage = 'No records to display.',
  loading = false,
  initialSort,
  onRowActivate,
  rowLabel,
}: DataTableProps<Row>) {
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(
    initialSort ?? null,
  );

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col || !col.sortable) return rows;
    const getValue = col.sortValue ?? ((row: Row) => (row as Record<string, unknown>)[col.key] as string | number | Date | null | undefined);
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = getValue(a);
      const bv = getValue(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av instanceof Date && bv instanceof Date) return (av.getTime() - bv.getTime()) * dir;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' }) * dir;
    });
  }, [rows, sort, columns]);

  const toggleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  }, []);

  const onHeaderKey = (e: KeyboardEvent<HTMLButtonElement>, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSort(key);
    }
  };

  const onRowKey = (e: KeyboardEvent<HTMLTableRowElement>, row: Row) => {
    if (!onRowActivate) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowActivate(row);
    }
  };

  const sortStatus = sort
    ? `Sorted by ${columns.find((c) => c.key === sort.key)?.header ?? sort.key}, ${sort.direction === 'asc' ? 'ascending' : 'descending'}.`
    : 'No sort applied.';

  return (
    <div className="w-full overflow-x-auto">
      <div className="sr-only" role="status" aria-live="polite">
        {loading ? 'Loading data.' : `${sortedRows.length} rows. ${sortStatus}`}
      </div>
      <table
        className="w-full border-collapse font-lato text-sm text-charcoal"
        aria-busy={loading || undefined}
        aria-rowcount={sortedRows.length + 1}
      >
        <caption
          className={
            captionHidden
              ? 'sr-only'
              : 'text-left font-montserrat text-xs uppercase tracking-widest text-charcoal/70 mb-3'
          }
        >
          {caption}
          {summary ? <span className="sr-only"> {summary}</span> : null}
        </caption>
        <thead className="bg-beige-light border-b border-charcoal/10">
          <tr>
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              const ariaSort: 'ascending' | 'descending' | 'none' = isSorted
                ? sort!.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none';
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? ariaSort : undefined}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 py-3 font-montserrat text-xs uppercase tracking-wider text-charcoal ${alignClass(col.align)}`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      onKeyDown={(e) => onHeaderKey(e, col.key)}
                      className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                      aria-label={`${col.header}, ${
                        isSorted
                          ? `currently sorted ${sort!.direction === 'asc' ? 'ascending' : 'descending'}, activate to ${sort!.direction === 'asc' ? 'sort descending' : 'clear sort'}`
                          : 'activate to sort ascending'
                      }`}
                    >
                      <span>{col.header}</span>
                      {isSorted ? (
                        sort!.direction === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-charcoal/60">
                Loading…
              </td>
            </tr>
          ) : sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-charcoal/60">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row, rowIndex) => {
              const key = rowKey(row);
              const interactive = Boolean(onRowActivate);
              return (
                <tr
                  key={key}
                  aria-rowindex={rowIndex + 2}
                  tabIndex={interactive ? 0 : undefined}
                  role={interactive ? 'button' : undefined}
                  aria-label={interactive && rowLabel ? rowLabel(row) : undefined}
                  onClick={interactive ? () => onRowActivate!(row) : undefined}
                  onKeyDown={interactive ? (e) => onRowKey(e, row) : undefined}
                  className={`border-b border-charcoal/5 ${interactive ? 'cursor-pointer hover:bg-beige-light/60 focus:bg-beige-light focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal' : ''}`}
                >
                  {columns.map((col, colIndex) => {
                    const content = col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as ReactNode);
                    const Cell = colIndex === 0 ? 'th' : 'td';
                    const cellProps = colIndex === 0 ? { scope: 'row' as const } : {};
                    return (
                      <Cell
                        key={col.key}
                        {...cellProps}
                        className={`px-4 py-3 align-top ${alignClass(col.align)} ${colIndex === 0 ? 'font-medium text-charcoal' : 'text-charcoal/80'}`}
                        aria-label={col.ariaLabel ? col.ariaLabel(row) : undefined}
                      >
                        {content ?? <span className="text-charcoal/40" aria-label="Not provided">—</span>}
                      </Cell>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
