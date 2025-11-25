'use client';

import { ImagePlus } from 'lucide-react';

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
};

const ImageUploader = ({ onChange, value }: Props) => {
  const preview = value ? URL.createObjectURL(value) : null;

  return (
    <div className="space-y-4 w-full">
      {/* Upload box */}
      <label
        htmlFor="image-upload"
        className="
          flex flex-col items-center justify-center
          w-full h-40 border-2 border-dashed border-slate-700/40
          rounded-xl cursor-pointer hover:border-sky-500
          transition-all duration-200
        "
      >
        <ImagePlus className="w-10 h-10 text-sky-400 mb-2" />
        <p className="text-slate-700 text-sm">
          {value ? value.name : 'Click to upload image'}
        </p>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            onChange(selected);
          }}
        />
      </label>

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          className="w-full max-w-2xl rounded-lg border object-cover"
          alt="Preview"
        />
      )}
    </div>
  );
};

export default ImageUploader;
