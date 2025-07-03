"use client"

import type React from "react"

import { useState } from "react"
import { FileUp, Check, AlertCircle, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { convertTableauToPowerBI } from "@/lib/convert-file"
import { cn } from "@/lib/utils"

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [convertedFile, setConvertedFile] = useState<{ url: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (droppedFile: File) => {
    setError(null)

    // Check if file is a Tableau file
    if (!droppedFile.name.toLowerCase().endsWith(".twbx")) {
      setError("Please upload a Tableau workbook (.twbx) file")
      return
    }

    setFile(droppedFile)
  }

  const startConversion = async () => {
    if (!file) return

    setIsConverting(true)
    setConversionProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setConversionProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 95 ? 95 : newProgress
        })
      }, 500)

      // Simulate conversion process
      const result = await convertTableauToPowerBI(file, (progress) => {
        setConversionProgress(progress)
      })

      clearInterval(progressInterval)
      setConversionProgress(100)

      // Set the converted file data
      setConvertedFile({
        url: result.url,
        name: file.name.replace(".twbx", ".pbit"),
      })
    } catch (err) {
      setError("Error converting file. Please try again.")
      console.error(err)
    } finally {
      setIsConverting(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setConvertedFile(null)
    setError(null)
    setConversionProgress(0)
  }

  return (
    <div className="space-y-6">
      {!file && !convertedFile && (
        <Card
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <FileUp className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Drag & Drop your Tableau file</h3>
              <p className="text-muted-foreground">Support for .twbx files up to 50MB</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                Select File
              </Button>
              <input id="file-upload" type="file" accept=".twbx" className="hidden" onChange={handleFileInput} />
            </div>
          </div>
        </Card>
      )}

      {file && !convertedFile && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileUp className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              {!isConverting && (
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  Change
                </Button>
              )}
            </div>

            {isConverting ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Converting...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(conversionProgress)}%</span>
                </div>
                <Progress value={conversionProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  This may take a few moments depending on the file size and complexity
                </p>
              </div>
            ) : (
              <Button className="w-full" onClick={startConversion}>
                Convert to Power BI
              </Button>
            )}
          </div>
        </Card>
      )}

      {convertedFile && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Conversion Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Your file has been successfully converted to Power BI format
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border rounded-md p-3">
              <FileUp className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium">{convertedFile.name}</h4>
                <p className="text-sm text-muted-foreground">Power BI Template (.pbit)</p>
              </div>
              <Button asChild>
                <a href={convertedFile.url} download={convertedFile.name}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={resetForm}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Convert Another File
              </Button>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 space-y-4 text-center">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-card">
            <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FileUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">Drag and drop your Tableau workbook (.twbx) file</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Convert</h3>
            <p className="text-sm text-muted-foreground">
              Our system analyzes and converts your Tableau file to Power BI format
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Get your converted Power BI template (.pbit) file ready to use
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
