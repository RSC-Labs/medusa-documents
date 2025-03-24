import moment from "moment";
import { useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Tooltip, TooltipProvider, StatusBadge, Text } from "@medusajs/ui";
import { currencies } from "./utils/currencies";
import { Grid, Link } from "@mui/material";
import { ActionsDropdown } from "../../actions-dropdown/actions-dropdown";
import InvoiceNumberFromOrder from "./invoice-number-from-order";
import PackingSlipNumber from "./packing-slip-number";
import { InformationCircle } from "@medusajs/icons";

/**
 * Checks the list of currencies and returns the divider/multiplier
 * that should be used to calculate the persited and display amount.
 * @param currency
 * @return {number}
 */
export function getDecimalDigits(currency: string) {
  const divisionDigits = currencies[currency.toUpperCase()].decimal_digits
  return Math.pow(10, divisionDigits)
}

export function normalizeAmount(currency: string, amount: number): number {
  const divisor = getDecimalDigits(currency)
  return Math.floor(amount) / divisor
}

type FormatMoneyProps = {
  amount: number
  currency: string
  digits?: number
}

function formatAmountWithSymbol({
  amount,
  currency,
  digits,
}: FormatMoneyProps) {
  let locale = "en-US"

  // We need this to display 'Kr' instead of 'DKK'
  if (currency.toLowerCase() === "dkk") {
    locale = "da-DK"
  }
  const taxRate = 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
  }).format(amount * (1 + taxRate / 100))
}

type DocumentNumber = {
  orderId: string | undefined,
  invoiceNumber: string | undefined,
  packingSlipNumber: string | undefined
}

const useOrderTableColumns = () => {
  const [documentNumbers, setDocumentNumbers] = useState<{ [key: string]: DocumentNumber }>({});

  const decideStatus = (status) => {
    switch (status) {
      case "captured":
        return (
          <StatusBadge color="green">Paid</StatusBadge>
        )
      case "awaiting":
        return (
          <StatusBadge color="grey">Awaiting</StatusBadge>
        )
      case "requires_action":
        return (
          <StatusBadge color="red">Requires action</StatusBadge>
        )
      case "canceled":
        return (
          <StatusBadge color="orange">Canceled</StatusBadge>
        )
      default:
        return (
          <StatusBadge color="purple">N/A</StatusBadge>
        )
    }
  }
  const decideFullfillmentStatus = (status) => {
    switch (status) {
      case "not_fulfilled":
        return (
          <StatusBadge color="grey">Not fulfilled</StatusBadge>
        )
      case "partially_fulfilled":
        return (
          <StatusBadge color="blue">Partially fulfilled</StatusBadge>
        )
      case "fulfilled":
        return (
          <StatusBadge color="green">Fulfilled</StatusBadge>
        )
      case "partially_shipped":
        return (
          <StatusBadge color="blue">Partially shipped</StatusBadge>
        )
      case "shipped":
        return (
          <StatusBadge color="green">Shipped</StatusBadge>
        )
      case "partially_returned":
        return (
          <StatusBadge color="blue">Partially returned</StatusBadge>
        )
      case "returned":
        return (
          <StatusBadge color="green">Returned</StatusBadge>
        )
      case "canceled":
        return (
          <StatusBadge color="red">Canceled</StatusBadge>
        )
      case "requires_action":
        return (
          <StatusBadge color="purple">Requires action</StatusBadge>
        )
      default:
        return (
          <StatusBadge color="grey">N/A</StatusBadge>
        )
    }
  }

  const updateInvoiceNumber = (orderId, invoiceNumber) => {
    setDocumentNumbers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        invoiceNumber,
      },
    }));
  };

  const updatePackingSlipNumber = (orderId, packingSlipNumber) => {
    setDocumentNumbers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        packingSlipNumber,
      },
    }));
  };

  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">{"Order"}</div>,
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: ("Date added"),
        accessor: "created_at",
        Cell: ({ cell: { value } }) => {
          return (
            <TooltipProvider>
              <Tooltip content={<Text>{moment(value).format("DD MMM YYYY hh:mm a")}</Text>}>
                <p className="text-grey-90 group-hover:text-violet-60 min-w-[40px]">
                  {moment(value).format("DD MMM YYYY")}
                </p>
              </Tooltip>
            </TooltipProvider>
          )
        }
      },
      {
        Header: ("Customer"),
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => {
          const customer={
            first_name:
              value?.first_name ||
              row.original.shipping_address?.first_name,
            last_name:
              value?.last_name || row.original.shipping_address?.last_name,
            email: row.original.email,
          }
          return (
            <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px]">{`${
              (customer.first_name || customer.last_name)
                ? `${customer.first_name} ${customer.last_name}`
                : (customer.email
                ? customer.email
                : "-")}`}</p>
          )
        },
      },
      {
        Header: ("Fulfillment"),
        accessor: "fulfillment_status",
        Cell: ({ cell: { value } }) => decideFullfillmentStatus(value),
      },
      {
        Header: ("Payment status"),
        accessor: "payment_status",
        Cell: ({ cell: { value } }) => decideStatus(value),
      },
      {
        Header: () => (
          <div className="text-right">{("Total")}</div>
        ),
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-grey-90 group-hover:text-violet-60 text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
            })}
          </div>
        ),
      },
      {
        Header: ("Documents"),
        id: "documents",
        Cell: ({ row }) => {
          const orderId = row.original.id;
          const currentDocumentNumbers = documentNumbers[orderId] || undefined;

          return (
            <p className="text-grey-90 group-hover:text-violet-60 pl-2">
              <Grid container justifyContent={'flex-start'} direction={'column'} spacing={1}>
                <InvoiceNumberFromOrder
                  orderId={orderId}
                  invoiceNumber={currentDocumentNumbers ? currentDocumentNumbers.invoiceNumber : undefined}
                />
                <PackingSlipNumber
                  orderId={orderId}
                  packingSlipNumber={currentDocumentNumbers ? currentDocumentNumbers.packingSlipNumber : undefined}
                />
              </Grid>
            </p>
          );
        },
      },
      {
        Header: () => (
          <Grid container justifyContent="flex-end" alignItems="flex-end" spacing={1}>
            <Grid item>
              <TooltipProvider>
                <Tooltip content={
                  <Grid item>
                    <Text size="small">We do not store documents. </Text>
                    <Link fontSize={12} href='https://github.com/RSC-Labs/medusa-documents?tab=readme-ov-file#what-means-we-do-not-store-documents'>
                      Learn more what it means. 
                    </Link>
                  </Grid>
                }>
                  <InformationCircle />
                </Tooltip>
              </TooltipProvider>
            </Grid>
            <Grid item>Actions</Grid>
          </Grid>
        ),
        id: "actions",
        Cell: ({ row }) => {
          return (
            <Grid container justifyContent={'flex-end'}>
              <Grid item>
                <ActionsDropdown 
                  order={row.original} 
                  updateInvoiceNumber={updateInvoiceNumber} 
                  updatePackingSlipNumber={updatePackingSlipNumber}
                />
              </Grid>
            </Grid>
          );
        }
      },
    ],
    [documentNumbers] // Add documentNumbers as a dependency to ensure it re-renders
  );

  return [columns, documentNumbers];
};

export default useOrderTableColumns;
