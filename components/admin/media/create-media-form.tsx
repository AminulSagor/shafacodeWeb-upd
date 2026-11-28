'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { Copy } from 'lucide-react';
import createMedia from '@/actions/media/create-media';

const CreateMediaForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setUploadedUrl(null);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const uploadMedia = async () => {
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `media-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shafacode')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('shafacode').getPublicUrl(fileName);

      const response = await createMedia({ url: publicUrl });

      if (!response?.success) {
        throw new Error('Failed to save media info');
      }

      toast.success('Uploaded!');
      setUploadedUrl(publicUrl);
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    toast.success('Copied URL!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Upload Input */}
        <div className="space-y-2">
          <Label>Select Image</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Preview */}
        {preview && (
          <div className=" relative max-w-lg aspect-video border rounded-md overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover w-full h-64"
            />
          </div>
        )}

        {/* Upload Button */}
        <Button onClick={uploadMedia} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>

        {/* Uploaded URL */}
        {uploadedUrl && (
          <div className="space-y-2">
            <Label>Public URL</Label>
            <div className="flex items-center gap-2">
              <Input value={uploadedUrl} readOnly className="flex-1" />
              <Button size="icon" variant="secondary" onClick={copyToClipboard}>
                <Copy size={18} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateMediaForm;
