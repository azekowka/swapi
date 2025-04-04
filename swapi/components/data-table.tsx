"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Column {
  key: string
  label: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column[]
  totalPages: number
  currentPage: number
  basePath: string
  getRowId: (item: T) => string
}

export function DataTable<T>({ data, columns, totalPages, currentPage, basePath, getRowId }: DataTableProps<T>) {
  const router = useRouter()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const handlePageChange = (page: number) => {
    router.push(`${basePath}?page=${page}`)
  }

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          href={`${basePath}?page=1}`}
          isActive={currentPage === 1}
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(1)
          }}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Calculate range of pages to show
    const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

    // Adjust if we're near the beginning
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`${basePath}?page=${i}`}
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={`${basePath}?page=${totalPages}`}
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => {
              const id = getRowId(item)
              return (
                <TableRow
                  key={id}
                  className="cursor-pointer hover:bg-muted/50"
                  onMouseEnter={() => setHoveredRow(id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => router.push(`${basePath}/${id}`)}
                >
                  {columns.map((column) => (
                    <TableCell key={`${id}-${column.key}`}>{item[column.key]}</TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`${basePath}?page=${currentPage - 1}`}
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1)
                }
              }}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {generatePaginationItems()}

          <PaginationItem>
            <PaginationNext
              href={`${basePath}?page=${currentPage + 1}`}
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1)
                }
              }}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

