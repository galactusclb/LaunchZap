"use client"

import { useEffect, useState } from "react"
import { CircleAlertIcon, ImageIcon, UploadIcon, XIcon, ZoomInIcon } from "lucide-react"

import { formatBytes, useFileUpload } from "@/hooks/use-file-upload"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert"

interface LogoUploadProps {
  maxSize?: number
  className?: string
  onChange?: (file: File | null) => void
}

export function LogoUpload({
  maxSize = 2 * 1024 * 1024, // 2MB for a logo
  className,
  onChange,
}: LogoUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const [{ files, isDragging, errors }, { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] =
    useFileUpload({
      maxFiles: 1,
      maxSize,
      accept: "image/*",
      multiple: false,
    })

  useEffect(() => {
    const file = files[0]?.file ?? null
    onChange?.(file instanceof File ? file : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  const current = files[0]

  return (
    <div className={cn("w-full", className)}>
      {!current ? (
        <div
          className={cn(
            "rounded-lg relative border border-dashed p-8 text-center transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />
          <div className="flex flex-col items-center gap-3">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", isDragging ? "bg-primary/10" : "bg-muted")}>
              <ImageIcon className={cn("h-5 w-5", isDragging ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Upload logo</p>
              <p className="text-muted-foreground text-xs">PNG, JPG up to {formatBytes(maxSize)}</p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openFileDialog() }}>
              <UploadIcon className="h-4 w-4" />
              Select image
            </Button>
          </div>
        </div>
      ) : (
        <div className="group/item relative aspect-square w-32">
          {isLoading && (
            <div className="bg-muted/50 rounded-lg absolute inset-0 flex items-center justify-center border">
              <Spinner className="text-muted-foreground size-5" />
            </div>
          )}
          <img
            src={current.preview}
            alt={current.file instanceof File ? current.file.name : current.file.name}
            onLoad={() => setIsLoading(false)}
            className={cn(
              "rounded-lg h-full w-full border object-cover transition-all",
              isLoading ? "opacity-0" : "opacity-100"
            )}
          />
          <div className="bg-black/50 absolute inset-0 rounded-lg flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover/item:opacity-100">
            <Button type="button" onClick={() => { setSelectedImage(current.preview!); setIsPreviewLoading(true) }} variant="secondary" size="icon" className="size-7">
              <ZoomInIcon className="h-4 w-4" />
            </Button>
            <Button type="button" onClick={() => removeFile(current.id)} variant="secondary" size="icon" className="size-7">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-3">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Upload error</AlertTitle>
          <AlertDescription>{errors.map((e, i) => <p key={i}>{e}</p>)}</AlertDescription>
        </Alert>
      )}

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-xl border-none bg-transparent shadow-none p-0">
          <DialogHeader className="sr-only"><DialogTitle>Logo preview</DialogTitle></DialogHeader>
          <div className="flex items-center justify-center">
            {isPreviewLoading && <Spinner className="absolute size-8 text-white" />}
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Preview"
                onLoad={() => setIsPreviewLoading(false)}
                className={cn("rounded-lg max-h-[80vh] w-auto object-contain transition-opacity", isPreviewLoading ? "opacity-0" : "opacity-100")}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
