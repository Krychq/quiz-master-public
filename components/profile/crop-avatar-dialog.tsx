"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropAvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onApply: (croppedAreaPixels: PixelCrop) => void;
  isBusy: boolean;
}

export function CropAvatarDialog({
  open,
  onOpenChange,
  imageSrc,
  onApply,
  isBusy,
}: CropAvatarDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [open, imageSrc]);

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: unknown) => {
      setCroppedAreaPixels(croppedAreaPixels as PixelCrop);
    },
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Avatar</DialogTitle>
        </DialogHeader>
        <div className="relative h-[300px] w-full bg-black/10 rounded-md overflow-hidden my-4">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <div className="px-4 pb-2">
          <Label className="text-xs font-semibold mb-2 block">Zoom</Label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 bg-secondary rounded-lg cursor-pointer"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onApply(croppedAreaPixels!)}
            disabled={isBusy || !croppedAreaPixels}
          >
            {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply & Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
