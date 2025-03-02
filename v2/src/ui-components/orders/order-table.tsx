import clsx from "clsx"
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

type OrdersResult = {
  count: number,
  limit: number,
  offset: number,
  orders: any[]
}

const OrderTable = ({ setContextFilters }: OrderTableProps) => {

  const location = useLocation()


  const [ordersResult, setOrdersResult] = useState<OrdersResult | undefined>(undefined)
  const [isLoading, setLoading] = useState(true)

  let hiddenColumns = ["sales_channel"]

  const {
    paginate,
    queryObject,
  } = useOrderFilters(defaultQueryProps)

  const offs = 0
  const lim = DEFAULT_PAGE_SIZE

  const [numPages, setNumPages] = useState(0)

  // const defaultQueryProps = {
  //   expand: "customer,shipping_address,billing_address,items",
  //   fields:
  //     "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code,metadata",
  // }
  

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/orders?order=-created_at&fields=id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code,metadata,items,*customer`, {
      credentials: "include",
    })
    .then((res) => res.json())
    .then((result) => {
      setOrdersResult(result)
      setLoading(false)
    })
    .catch((error) => {
      console.error(error);
    }) 
  }, [isLoading])

  useEffect(() => {
    const controlledPageCount = Math.ceil(ordersResult ? ordersResult.count / queryObject.limit : 0)
    setNumPages(controlledPageCount)
  }, [ordersResult])


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
      data: ordersResult ? ordersResult.orders : [],
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
        count={ordersResult ? ordersResult.count : 0}
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
