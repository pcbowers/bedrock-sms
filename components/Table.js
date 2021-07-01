import { useState, useCallback } from "react";
import { useSortBy, useTable, useGlobalFilter, useAsyncDebounce } from "react-table";


function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 1000);

  return (
    <div className="mt-2 w-full box-border px-6 text-center">
      <input
        className="bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-2 outline-none"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search`}
      />
    </div>
  )
}

export default function Table({ columns, data }) {
  const tableInstance = useTable({
    columns,
    data
  }, useGlobalFilter, useSortBy)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter
  } = tableInstance

  return (
    // apply the table props
    <div className="flex flex-col">
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <div className="mb-2 overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-900 rounded">
            <table className="dark:text-gray-100 min-w-full divide-y divide-gray-200 dark:divide-gray-900" {...getTableProps()}>
              <thead className="bg-gray-200 dark:bg-gray-800">
                {// Loop over the header rows
                  headerGroups.map(headerGroup => {
                    const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                    return (
                      // Apply the header row props
                      <tr className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider" key={key} {...restHeaderGroupProps}>
                        {// Loop over the headers in each row
                          headerGroup.headers.map(column => {
                            const { key, ...restHeaderProps } = column.getHeaderProps(column.getSortByToggleProps())
                            return (
                              // Apply the header cell props
                              <th className="py-3 px-6 text-center" key={key} {...restHeaderProps}>
                                {// Render the header
                                  column.render('Header')
                                }
                                <span>
                                  {
                                    column.isSorted
                                      ? column.isSortedDesc
                                        ? " 🔽"
                                        : " 🔼"
                                      : ""
                                  }
                                </span>
                              </th>
                            )
                          })}
                      </tr>
                    )
                  })}
              </thead>
              {/* Apply the table body props */}
              <tbody className="bg-gray-100 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900" {...getTableBodyProps()}>
                {// Loop over the table rows
                  rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row)
                    const { key, ...restRowProps } = row.getRowProps()
                    return (
                      // Apply the row props
                      <tr className="hover:bg-gray-200 dark:hover:bg-gray-600" key={key} {...restRowProps}>
                        {// Loop over the rows cells
                          row.cells.map(cell => {
                            const { key, ...restCellProps } = cell.getCellProps()
                            // Apply the cell props
                            return (
                              <td className="max-w-xs px-6 py-4 text-center" key={key} {...restCellProps}>
                                {// Render the cell contents
                                  cell.render('Cell')}
                              </td>
                            )
                          })}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  )
}