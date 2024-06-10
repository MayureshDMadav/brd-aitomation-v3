'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'

const SearchBar = ({ onSearch } : { onSearch:any }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search submissions..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  )
}

export default SearchBar