import clsx from "clsx"
import { useAdminOrders } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import useOrderTableColums from "./order-table/use-columns"
import { useOrderFilters } from "./order-table/use-orders"
import { Table } from "@medusajs/ui";

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "customer,shipping_address,billing_address,items",
  fields:
    "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code,metadata",
}

type OrderTableProps = {
  setContextFilters: (filters: Record<string, { filter: string[] }>) => void
}

const OrderTable = ({ setContextFilters }: OrderTableProps) => {

  const location = useLocation()

  let hiddenColumns = ["sales_channel"]

  const {
    paginate,
    queryObject,
  } = useOrderFilters(defaultQueryProps)

  const offs = 0
  const lim = DEFAULT_PAGE_SIZE

  const [numPages, setNumPages] = useState(0)

  const { orders, isLoading, count } = useAdminOrders(queryObject, {
    keepPreviousData: true,
  })

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [orders])


  const [columns] = useOrderTableColums()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: orders || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
        hiddenColumns,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  return (
    <>
      <Table
        {...getTableProps()}
        className={clsx({ ["relative"]: isLoading })}
      >
        <Table.Header>
          {headerGroups?.map((headerGroup) => (
            <Table.Row {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeaderCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Table.Row
                color={"inherit"}
                linkTo={row.original.id}
                {...row.getRowProps()}
                className="group"
              >
                {row.cells.map((cell) => {
                  return (
                    <Table.Cell {...cell.getCellProps()} className="inter-small-regular h-[40px]">
                      {cell.render("Cell")}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <Table.Pagination
        count={count}
        pageSize={queryObject.offset + rows.length}
        pageIndex={pageIndex}
        pageCount={pageCount}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={handlePrev}
        nextPage={handleNext}
      />
    </>
  )
}

export default React.memo(OrderTable)
