import React, { useState, useRef } from 'react'
import { Upload, X, Check, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ImageUploadProps {
  onUploadSuccess: () => void
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      setUploadStatus('error')
      setErrorMessage('Please select valid image files.')
      setTimeout(() => setUploadStatus('idle'), 3000)
      return
    }

    for (const file of imageFiles) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadStatus('idle')
    setErrorMessage('')

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      // Save to database
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          filename: file.name,
          url: publicUrl
        })

      if (dbError) throw dbError

      setUploadStatus('success')
      onUploadSuccess()
      setTimeout(() => setUploadStatus('idle'), 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed')
      setTimeout(() => setUploadStatus('idle'), 3000)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getUploadButtonContent = () => {
    if (isUploading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Uploading...</span>
        </div>
      )
    }

    if (uploadStatus === 'success') {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <Check className="w-5 h-5" />
          <span>Uploaded!</span>
        </div>
      )
    }

    if (uploadStatus === 'error') {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>Error</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Upload className="w-5 h-5" />
        <span>Upload Photo</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-colors
              ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
            `}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragging ? 'Drop your images here' : 'Upload your photos'}
            </p>
            <p className="text-gray-600">
              Drag & drop images here, or click to browse
            </p>
          </div>

          <button
            type="button"
            disabled={isUploading}
            className={`
              inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${uploadStatus === 'success' 
                ? 'bg-green-100 text-green-700 cursor-default' 
                : uploadStatus === 'error'
                ? 'bg-red-100 text-red-700 cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
              }
              ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            {getUploadButtonContent()}
          </button>

          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}