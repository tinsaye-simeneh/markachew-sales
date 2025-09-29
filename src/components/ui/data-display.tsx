"use client"

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Grid3X3, 
  LayoutGrid, 
  Table as TableIcon,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type ViewType = 'table' | 'card' | 'grid'

export interface DataDisplayColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  filterOptions?: Array<{ value: string; label: string }>
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: any) => React.ReactNode
  className?: string
}

export interface DataDisplayAction {
  key: string
  label: string
  icon?: React.ReactNode
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (item: any) => void
  variant?: 'default' | 'destructive' | 'outline'
  className?: string
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataDisplayProps<T = any> {
  data: T[]
  columns: DataDisplayColumn[]
  actions?: DataDisplayAction[] | ((item: T) => DataDisplayAction[])
  loading?: boolean
  emptyMessage?: string
  title?: string
  description?: string
  defaultView?: ViewType
  showViewToggle?: boolean
  showSearch?: boolean
  showPagination?: boolean
  showFilters?: boolean
  searchPlaceholder?: string
  searchFields?: string[]
  itemsPerPage?: number
  currentPage?: number
  totalItems?: number
  className?: string
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onItemClick?: (item: T) => void
  onSearch?: (searchTerm: string) => void
  onPageChange?: (page: number) => void
  onFilter?: (column: string, value: string) => void
  itemKey?: (item: T) => string | number
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataDisplay<T = any>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'No data available',
  title,
  description,
  defaultView = 'table',
  showViewToggle = true,
  showSearch = true,
  showPagination = true,
  showFilters = true,
  searchPlaceholder = 'Search...',
  searchFields = [],
  itemsPerPage = 5,
  currentPage: externalCurrentPage,
  totalItems: externalTotalItems,
  className = '',
  onSort,
  onItemClick,
  onSearch,
  onPageChange,
  onFilter,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemKey = (item: any) => item.id || item.key || Math.random()
}: DataDisplayProps<T>) {
  const [viewType, setViewType] = useState<ViewType>(defaultView)
  
  // Helper function to get nested property values
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
  
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Record<string, string>>({})
  
  // Use external pagination if provided, otherwise use internal state
  const currentPage = externalCurrentPage ?? internalCurrentPage
  const totalItems = externalTotalItems ?? data.length

  const handleSort = (column: string) => {
    if (!onSort) return
    
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)
    onSort(column, newDirection)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Reset to first page when searching
    if (externalCurrentPage === undefined) {
      setInternalCurrentPage(1)
    }
    if (onSearch) {
      onSearch(value)
    }
  }

  const handlePageChange = (page: number) => {
    if (externalCurrentPage === undefined) {
      setInternalCurrentPage(page)
    }
    if (onPageChange) {
      onPageChange(page)
    }
  }

  const handleFilter = (column: string, value: string) => {
    const newFilters = { ...filters }
    if (value === 'all' || value === '') {
      delete newFilters[column]
    } else {
      newFilters[column] = value
    }
    setFilters(newFilters)
    
    // Reset to first page when filtering
    if (externalCurrentPage === undefined) {
      setInternalCurrentPage(1)
    }
    
    if (onFilter) {
      onFilter(column, value)
    }
  }

  const clearAllFilters = () => {
    setFilters({})
    if (externalCurrentPage === undefined) {
      setInternalCurrentPage(1)
    }
  }

  // Filter data based on search term and column filters
  const filteredData = useMemo(() => {
    let result = data

    // Apply search filter
    if (searchTerm && showSearch) {
      const fieldsToSearch = searchFields.length > 0 ? searchFields : columns.map(col => col.key)
      
      result = result.filter((item) => {
        return fieldsToSearch.some((field) => {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = (item as any)[field]
          if (value === null || value === undefined) return false
          
          // Handle nested properties (e.g., 'employer.full_name')
          const nestedValue = field.includes('.') 
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? field.split('.').reduce((obj: any, key: string) => obj?.[key], item)
            : value
          
          return String(nestedValue).toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
    }

    // Apply column filters
    if (showFilters && Object.keys(filters).length > 0) {
      result = result.filter((item) => {
        return Object.entries(filters).every(([column, filterValue]) => {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = (item as any)[column]
          if (value === null || value === undefined) return false
          
          // Handle nested properties (e.g., 'employer.full_name')
          const nestedValue = column.includes('.') 
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? column.split('.').reduce((obj: any, key: string) => obj?.[key], item)
            : value
          
          return String(nestedValue).toLowerCase() === filterValue.toLowerCase()
        })
      })
    }

    return result
  }, [data, searchTerm, searchFields, columns, showSearch, filters, showFilters])

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  // Get paginated data (only if using internal pagination)
  const paginatedData = useMemo(() => {
    if (externalCurrentPage !== undefined || !showPagination) {
      return filteredData
    }
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, startIndex, endIndex, externalCurrentPage, showPagination])

  const renderSearch = () => {
    if (!showSearch) return null

    return (
      <div className="relative max-w-lg"> 
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
     
    )
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderFilters = () => {
    if (!showFilters) return null

    const filterableColumns = columns.filter(col => col.filterable && col.filterOptions)
    if (filterableColumns.length === 0) return null

    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Filters:</span>
        </div>
        <div className="flex items-center space-x-2">
          {filterableColumns.map((column) => (
            <div key={column.key} className="flex items-center space-x-1">
              <Select
                value={filters[column.key] || 'all'}
                onValueChange={(value) => handleFilter(column.key, value)}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue placeholder={column.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {column.label}</SelectItem>
                  {column.filterOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {Object.keys(filters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const renderViewToggle = () => {
    if (!showViewToggle) return null

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">View:</span>
        <div className="flex border rounded-lg">
          <Button
            variant={viewType === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewType('table')}
            className="rounded-r-none border-r cursor-pointer"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewType('card')}
            className="rounded-none border-r cursor-pointer"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewType('grid')}
            className="rounded-l-none cursor-pointer"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null

    const getVisiblePages = () => {
      const delta = 2
      const range = []
      const rangeWithDots = []

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i)
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...')
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages)
      } else {
        rangeWithDots.push(totalPages)
      }

      return rangeWithDots
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className="cursor-pointer"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const renderActions = (item: T) => {
    const itemActions = typeof actions === 'function' ? actions(item) : actions
    if (itemActions.length === 0) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className='cursor-pointer'>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {itemActions.map((action) => (
            <DropdownMenuItem
              key={action.key}
              onClick={() => action.onClick(item)}
              className={action.variant === 'destructive' ? 'text-red-600' : action.className}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderTableView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (paginatedData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{searchTerm ? 'No results found' : emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={`${column.className || ''} ${column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {(typeof actions === 'function' ? (paginatedData.length > 0 ? actions(paginatedData[0]).length > 0 : false) : actions.length > 0) && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow 
                key={itemKey(item)}
                className={onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={() => onItemClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className || ''}>
                    {column.render 
                      ? column.render(getNestedValue(item, column.key), item)
                      : getNestedValue(item, column.key)
                    }
                  </TableCell>
                ))}
                {(typeof actions === 'function' ? actions(item).length > 0 : actions.length > 0) && (
                  <TableCell>
                    {renderActions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderCardView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (paginatedData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{searchTerm ? 'No results found' : emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {paginatedData.map((item) => (
          <Card 
            key={itemKey(item)}
            className={`${onItemClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
            onClick={() => onItemClick?.(item)}
          >
              <CardContent className="p-2 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  {columns.map((column) => (
                    <div key={column.key} className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 min-w-24">
                        {column.label}:
                      </span>
                      <span className="text-sm">
                        {column.render 
                          ? column.render(getNestedValue(item, column.key), item)
                          : getNestedValue(item, column.key)
                        }
                      </span>
                    </div>
                  ))}
                </div>
                {(typeof actions === 'function' ? actions(item).length > 0 : actions.length > 0) && (
                  <div className="ml-4 -mt-2">
                    {renderActions(item)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderGridView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (paginatedData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{searchTerm ? 'No results found' : emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedData.map((item) => (
          <Card 
            key={itemKey(item)}
            className={`${onItemClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
            onClick={() => onItemClick?.(item)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-medium truncate">
                  {columns[0]?.render 
                    ? columns[0].render(getNestedValue(item, columns[0].key), item)
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    : (item as any)[columns[0]?.key]
                  }
                </CardTitle>
                {(typeof actions === 'function' ? actions(item).length > 0 : actions.length > 0) && (
                  <div>
                    {renderActions(item)}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {columns.slice(1).map((column) => (
                  <div key={column.key} className="text-xs">
                    <span className="text-gray-500">{column.label}: </span>
                    <span>
                      {column.render 
                        ? column.render(getNestedValue(item, column.key), item)
                        : getNestedValue(item, column.key)
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    switch (viewType) {
      case 'table':
        return renderTableView()
      case 'card':
        return renderCardView()
      case 'grid':
        return renderGridView()
      default:
        return renderTableView()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description || showViewToggle || showSearch) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold">{title} {((totalItems > 0) && `(${totalItems})`)}</h3>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
          <div className="flex items-center space-x-4">
            {showSearch && renderSearch()}
            {renderViewToggle()}
          </div>
        </div>
      )}
      {renderContent()}
      {renderPagination()}
    </div>
  )
}

export const createDataDisplayActions = {
  
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  edit: (onClick: (item: any) => void): DataDisplayAction => ({
    key: 'edit',
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick
  }),
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: (onClick: (item: any) => void): DataDisplayAction => ({
    key: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick,
    variant: 'destructive'
  })
}