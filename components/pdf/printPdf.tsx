'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MdPrint } from 'react-icons/md'

const PrintCurrentTab = () => {

  const handlePrintCurrentTab = () => {
    console.log(document.querySelector("#download_pdf"))
    window.print()
  }

  return (
    <div >
      <Button
        variant="outline"
        className="mt-8 flex items-center gap-2"
        id='print_button'
        onClick={handlePrintCurrentTab}
      >
        <MdPrint />
        Print Current
      </Button>
    </div>
  )
}

export default PrintCurrentTab