'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { XIcon, UploadIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  images: File[];
  maxImages: number;
}

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  images,
  maxImages = 5,
}) => {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Create URLs for preview images
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((file) => {
          if (file.file.size > MAX_FILE_SIZE) return 'File too large (max 5MB)';
          return 'Invalid file type';
        });
        setError(errors[0]);
        setTimeout(() => setError(null), 3000);
        return;
      }

      const remainingSlots = maxImages - images.length;
      const filesToProcess = acceptedFiles.slice(0, remainingSlots);

      const newUploadingImages = filesToProcess.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }));

      setUploadingImages((prev) => [...prev, ...newUploadingImages]);

      // Simulate upload progress
      newUploadingImages.forEach((img) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setUploadingImages((prev) =>
            prev.map((u) => (u.id === img.id ? { ...u, progress } : u)),
          );

          if (progress >= 100) {
            clearInterval(interval);
            setUploadingImages((prev) => prev.filter((u) => u.id !== img.id));
            onUpload([...images, img.file]);
            URL.revokeObjectURL(img.preview);
          }
        }, 300);
      });
    },
    [images, maxImages, onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const updatedFiles = images.filter((_, i) => i !== index);
    onUpload(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : images.length >= maxImages
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-primary_1 cursor-pointer hover:bg-primary_1/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="min-h-[200px]">
          {images.length === 0 && uploadingImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <UploadIcon className="h-8 w-8 text-primary_1" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  Drag & drop images here, or click to select files
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Maximum {maxImages} images allowed</p>
                  <p>Supported formats: JPG, PNG, WEBP</p>
                  <p>Maximum size: 5MB per image</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Existing images */}
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={url || '/placeholder.svg'}
                    alt={`Uploaded ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Uploading images */}
              {uploadingImages.map((image) => (
                <div key={image.id} className="relative aspect-square">
                  <Image
                    src={image.preview || '/placeholder.svg'}
                    alt="Uploading"
                    fill
                    className="object-cover rounded-lg filter blur-[2px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <div className="w-2/3">
                      <Progress value={image.progress} className="h-2" />
                      <p className="text-white text-xs mt-2 text-center">
                        {image.progress}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-500 text-center">
        {images.length} of {maxImages} images uploaded
      </div>
    </div>
  );
};

export default ImageUpload;
