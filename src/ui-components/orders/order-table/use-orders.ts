import { useMemo, useReducer } from "react"
import { relativeDateFormatToTimestamp } from "./utils/time"

type OrderDateFilter = null | {
  gt?: string
  lt?: string
}

type OrderFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: OrderFilterState }
  | { type: "reset"; payload: OrderFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: OrderDefaultFilters | null }
  | { type: "setDate"; payload: OrderDateFilter }
  | { type: "setStatus"; payload: null | string[] | string }
  | { type: "setFulfillment"; payload: null | string[] | string }
  | { type: "setPayment"; payload: null | string[] | string }

interface OrderFilterState {
  query?: string | null
  region: {
    open: boolean
    filter: null | string[] | string
  }
  salesChannel: {
    open: boolean
    filter: null | string[] | string
  }
  status: {
    open: boolean
    filter: null | string[] | string
  }
  fulfillment: {
    open: boolean
    filter: null | string[] | string
  }
  payment: {
    open: boolean
    filter: null | string[] | string
  }
  date: {
    open: boolean
    filter: OrderDateFilter
  }
  limit: number
  offset: number
  additionalFilters: OrderDefaultFilters | null
}

const formatDateFilter = (filter: OrderDateFilter) => {
  if (filter === null) {
    return filter
  }

  const dateFormatted = Object.entries(filter).reduce((acc, [key, value]) => {
    if (value.includes("|")) {
      acc[key] = relativeDateFormatToTimestamp(value)
    } else {
      acc[key] = value
    }
    return acc
  }, {})

  return dateFormatted
}

const reducer = (
  state: OrderFilterState,
  action: OrderFilterAction
): OrderFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        region: action.payload.region,
        salesChannel: action.payload.salesChannel,
        fulfillment: action.payload.fulfillment,
        payment: action.payload.payment,
        status: action.payload.status,
        date: action.payload.date,
        query: action?.payload?.query,
      }
    }
    case "setQuery": {
      return {
        ...state,
        offset: 0, // reset offset when query changes
        query: action.payload,
      }
    }
    case "setDate": {
      const newDateFilters = state.date
      return {
        ...state,
        date: newDateFilters,
      }
    }
    case "setOffset": {
      return {
        ...state,
        offset: action.payload,
      }
    }
    case "reset": {
      return action.payload
    }
    default: {
      return state
    }
  }
}

type OrderDefaultFilters = {
  expand?: string
  fields?: string
}

export const useOrderFilters = (
  defaultFilters: OrderDefaultFilters | null = null
) => {

  const initial = useMemo(
    () => parseQueryString(defaultFilters),
    [defaultFilters]
  )

  const [state, dispatch] = useReducer(reducer, initial)

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: "setOffset", payload: nextOffset })
    } else {
      const nextOffset = Math.max(state.offset - state.limit, 0)
      dispatch({ type: "setOffset", payload: nextOffset })
    }
  }

  const getQueryObject = () => {
    const toQuery: any = { ...state.additionalFilters }
    for (const [key, value] of Object.entries(state)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      } else if (value.open) {
        if (key === "date") {
          toQuery[stateFilterMap[key]] = formatDateFilter(
            value.filter as OrderDateFilter
          )
        } else {
          toQuery[stateFilterMap[key]] = value.filter
        }
      }
    }

    return toQuery
  }

  const queryObject = useMemo(() => getQueryObject(), [state])

  return {
    queryObject,
    paginate,
  }
}

const stateFilterMap = {
  region: "region_id",
  salesChannel: "sales_channel_id",
  status: "status",
  fulfillment: "fulfillment_status",
  payment: "payment_status",
  date: "created_at",
}

const parseQueryString = (
  additionals: OrderDefaultFilters | null = null
): OrderFilterState => {
  const defaultVal: OrderFilterState = {
    status: {
      open: false,
      filter: null,
    },
    fulfillment: {
      open: false,
      filter: null,
    },
    region: {
      open: false,
      filter: null,
    },
    salesChannel: {
      open: false,
      filter: null,
    },
    payment: {
      open: false,
      filter: null,
    },
    date: {
      open: false,
      filter: null,
    },
    offset: 0,
    limit: 15,
    additionalFilters: additionals,
  }

  return defaultVal
}
