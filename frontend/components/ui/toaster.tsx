'use client'

import { useToast } from '@/components/ui/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="up" duration={4000}>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          className="bg-gradient-to-r from-primary/90 to-primary shadow-2xl text-white border border-white/30 rounded-xl px-6 py-4 
                     animate-in fade-in slide-in-from-top-8 duration-700 ease-out
                     data-[state=open]:animate-in data-[state=closed]:animate-out 
                     data-[state=closed]:slide-out-to-top-8 font-semibold w-full"
        >
          <div className="grid gap-1">
            {title && (
              <ToastTitle className="text-lg font-bold drop-shadow-sm">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-sm text-white/90">
                {description}
              </ToastDescription>
            )}
          </div>
          {action}
          <ToastClose className="text-white hover:text-gray-200 transition" />
        </Toast>
      ))}

      <ToastViewport
        className="fixed! top-6! left-1/2! -translate-x-1/2! z-9999!
                   flex flex-col gap-3 w-full max-w-sm px-4 pointer-events-none"
      />
    </ToastProvider>
  )
}
