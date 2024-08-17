import React from 'react'
import { Button } from '@/components/ui/button'

const PDFViewer = ({ pdfDataUrl, certificateType }) => {
  return (
    <div className="w-1/2 p-4 overflow-auto">
      <h2 className="text-xl mb-2">
        {certificateType.charAt(0).toUpperCase() + certificateType.slice(1)} Certificate Preview
      </h2>
      <Button onClick={() => window.print()} className="mb-2">
        Print {certificateType.charAt(0).toUpperCase() + certificateType.slice(1)} Certificate
      </Button>
      <iframe src={pdfDataUrl} className="w-full h-[calc(100%-80px)] border-none" />
    </div>
  )
}

export default PDFViewer
