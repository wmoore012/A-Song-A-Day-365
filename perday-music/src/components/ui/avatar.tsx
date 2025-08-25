// src/components/ui/avatar.tsx
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

type RootProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;
type ImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;
type FallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    RootProps
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        data-slot="avatar"
        className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
    />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    ImageProps
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        data-slot="avatar-image"
        className={cn("aspect-square size-full", className)}
        {...props}
    />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    FallbackProps
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        data-slot="avatar-fallback"
        className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
        {...props}
    />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };