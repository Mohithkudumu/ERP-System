import { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, ChevronDown, ChevronUp, Inbox } from 'lucide-react';

const ROWS_PER_PAGE = 8;

export default function DataTable({ title, columns, data, onEdit, onDelete, renderBadge }) {
    const [search, setSearch] = useState('');
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(1);

    const handleSort = (col) => {
        if (sortCol === col) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCol(col);
            setSortDir('asc');
        }
    };

    const filtered = useMemo(() => {
        if (!search) return data;
        const q = search.toLowerCase();
        return data.filter(row =>
            columns.some(col => {
                const val = row[col.key];
                return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
            })
        );
    }, [data, search, columns]);

    const sorted = useMemo(() => {
        if (!sortCol) return filtered;
        return [...filtered].sort((a, b) => {
            const aVal = a[sortCol] ?? '';
            const bVal = b[sortCol] ?? '';
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            }
            const cmp = String(aVal).localeCompare(String(bVal));
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortCol, sortDir]);

    const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
    const paginated = sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

    // Reset page when search changes
    const handleSearch = (val) => {
        setSearch(val);
        setPage(1);
    };

    return (
        <div className="table-wrapper">
            <div className="table-toolbar">
                <h2>{title}</h2>
                <div className="table-search">
                    <Search />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        id={`search-${title?.replace(/\s/g, '-').toLowerCase()}`}
                    />
                </div>
            </div>

            {paginated.length === 0 ? (
                <div className="empty-state">
                    <Inbox />
                    <h3>No records found</h3>
                    <p>{search ? 'Try adjusting your search query' : 'Add a new record to get started'}</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th
                                        key={col.key}
                                        className={sortCol === col.key ? 'sorted' : ''}
                                        onClick={() => handleSort(col.key)}
                                    >
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            {col.label}
                                            {sortCol === col.key && (
                                                sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                            )}
                                        </span>
                                    </th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(row => (
                                <tr key={row.id}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.key === 'status' && renderBadge
                                                ? renderBadge(row[col.key])
                                                : col.format
                                                    ? col.format(row[col.key])
                                                    : row[col.key]}
                                        </td>
                                    ))}
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="btn-icon"
                                                title="Edit"
                                                onClick={() => onEdit(row)}
                                                id={`edit-${row.id}`}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="btn-icon danger"
                                                title="Delete"
                                                onClick={() => onDelete(row)}
                                                id={`delete-${row.id}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {sorted.length > ROWS_PER_PAGE && (
                <div className="table-footer">
                    <span>
                        Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, sorted.length)} of {sorted.length}
                    </span>
                    <div className="pagination">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={page === pageNum ? 'active' : ''}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}
