import { ChevronsUpDown } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Table, Form, Pagination } from "react-bootstrap";

const DataTable = ({
  columns,
  data,
  itemsPerPage = 10,
  autoIndex = false,
  title,
  add,
  hideSearch = false,
  onRowClick,
  idAccessor,
  isSelectable = false,
  selectedData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Sorting
  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortColumn) {
      sorted.sort((a, b) => {
        const valA =
          typeof sortColumn === "function" ? sortColumn(a) : a[sortColumn];
        const valB =
          typeof sortColumn === "function" ? sortColumn(b) : b[sortColumn];

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [data, sortColumn, sortOrder]);

  // Filtering
  const filteredData = useMemo(() => {
    return sortedData.filter((item) =>
      columns.some(
        (column) =>
          column.accessor &&
          String(
            typeof column.accessor === "function"
              ? column.accessor(item)
              : item[column.accessor]
          )
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, columns, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleRowSelect = (rowIdentifier) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIdentifier)) {
      newSelectedRows.delete(rowIdentifier);
    } else {
      newSelectedRows.add(rowIdentifier);
    }
    setSelectedRows(newSelectedRows);
    if (selectedData) {
      selectedData(
        Array.from(newSelectedRows).map((id) =>
          data.find((row) => (idAccessor ? row[idAccessor] : row) === id)
        )
      );
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentItems.length) {
      setSelectedRows(new Set());
    } else {
      const newSelectedRows = new Set(
        currentItems.map((row) => (idAccessor ? row[idAccessor] : row))
      );
      setSelectedRows(newSelectedRows);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {title && <h4>{title}</h4>}
        {!hideSearch && data.length > 0 && (
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ maxWidth: "250px" }}
          />
        )}
      </div>

      {/* Table */}
      <Table responsive bordered hover >
        <thead>
          <tr>
            {isSelectable && (
              <th>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.size === currentItems.length}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {autoIndex && <th>#</th>}
            {columns.map((column, index) => (
              <th
                key={index}
                style={{ cursor: column.sortable ? "pointer" : "default" }}
                onClick={() => column.sortable && handleSort(column.accessor)}
              >
                {column.header}
                {column.sortable && <ChevronsUpDown className="h-4 w-4" />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, rowIndex) => {
            const rowIdentifier = idAccessor ? row[idAccessor] : row;
            return (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(rowIdentifier)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {isSelectable && (
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.has(rowIdentifier)}
                      onChange={() => handleRowSelect(rowIdentifier)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {autoIndex && (
                  <td>{(currentPage - 1) * itemsPerPage + rowIndex + 1}</td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.cell
                      ? column.cell(row)
                      : typeof column.accessor === "function"
                        ? column.accessor(row)
                        : row[column.accessor]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-3">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      )}
    </div>
  );
};

export default DataTable;
