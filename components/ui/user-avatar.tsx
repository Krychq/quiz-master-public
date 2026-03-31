"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  fallbackIcon?: React.ReactNode;
  showSpinner?: boolean;
  imageProps?: Partial<ImageProps>;
}

export function UserAvatar({
  src,
  alt = "User avatar",
  className,
  fallbackClassName,
  fallbackIcon,
  showSpinner = true,
  imageProps,
}: UserAvatarProps) {
  const [isAvatarLoading, setIsAvatarLoading] = React.useState(!!src);

  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {src && (
        <AvatarImage src={src} alt={alt} asChild>
          <Image
            src={src}
            alt={alt}
            height={imageProps?.height || 40}
            width={imageProps?.width || 40}
            onLoad={() => setIsAvatarLoading(false)}
            onError={() => setIsAvatarLoading(false)}
            placeholder={imageProps?.placeholder || "blur"}
            blurDataURL={imageProps?.blurDataURL || src}
            unoptimized={src.startsWith("blob:")}
            {...imageProps}
          />
        </AvatarImage>
      )}
      <AvatarFallback className={cn("text-foreground", fallbackClassName)}>
        {isAvatarLoading && showSpinner ? (
          <Spinner className="h-1/2 w-1/2 text-current" />
        ) : (
          fallbackIcon || <User className="h-1/2 w-1/2" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
