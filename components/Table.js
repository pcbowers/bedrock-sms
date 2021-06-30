import { useTable } from "react-table";

export default function Table({ columns, data }) {
  const tableInstance = useTable({
    columns,
    data
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    // apply the table props
    <div className="flex flex-col">
      <div className="my-2 overflow-x-auto sm:mx-6 lg:mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-900 rounded">
            <table className="dark:text-gray-100 min-w-full divide-y divide-gray-200 dark:divide-gray-900" {...getTableProps()}>
              <thead className="bg-gray-200 dark:bg-gray-800">
                {// Loop over the header rows
                  headerGroups.map(headerGroup => (
                    // Apply the header row props
                    <tr className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider" {...headerGroup.getHeaderGroupProps()}>
                      {// Loop over the headers in each row
                        headerGroup.headers.map(column => (
                          // Apply the header cell props
                          <th className="py-3 px-6 text-center" {...column.getHeaderProps()}>
                            {// Render the header
                              column.render('Header')}
                          </th>
                        ))}
                    </tr>
                  ))}
              </thead>
              {/* Apply the table body props */}
              <tbody className="bg-gray-100 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900" {...getTableBodyProps()}>
                {// Loop over the table rows
                  rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                      // Apply the row props
                      <tr className="hover:bg-gray-200 dark:hover:bg-gray-600" {...row.getRowProps()}>
                        {// Loop over the rows cells
                          row.cells.map(cell => {
                            // Apply the cell props
                            return (
                              <td className="max-w-xs px-6 py-4 text-center" {...cell.getCellProps()}>
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
    </div>
  )
}