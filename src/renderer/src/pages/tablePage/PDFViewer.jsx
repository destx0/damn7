import React from 'react'
import { Button } from '@/components/ui/button'

const PDFViewer = ({ pdfDataUrl, certificateType, isFullView, toggleFullView }) => {
  const handlePrint = () => {
    // Since this is an Electron app, we can use the Electron API to print
    if (window.electron) {
      window.electron.printPDF(pdfDataUrl)
    } else {
      // Fallback to browser printing if Electron API is not available
      window.print()
    }
  }

  return (
    <div className={`p-4 overflow-auto ${isFullView ? 'w-full' : 'w-1/2'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl">
          {certificateType.charAt(0).toUpperCase() + certificateType.slice(1)} Certificate Preview
        </h2>
        <div>
          <Button onClick={handlePrint} className="mr-2">
            Print Certificate
          </Button>
          <Button onClick={toggleFullView}>
            {isFullView ? 'Exit Full View' : 'Full Window View'}
          </Button>
        </div>
      </div>
      <iframe src={pdfDataUrl} className="w-full h-[calc(100%-60px)] border-none" />
    </div>
  )
}

export default PDFViewer
