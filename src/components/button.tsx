import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-[16px] font-medium transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50 focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b to-[#1b495c] from-[#57bbce] text-[#fff]',
        primary:
          'bg-[linear-gradient(90deg,_rgb(170,232,238)_0%,_rgb(81,185,203)_15%,_rgb(57,172,194)_27%,_rgb(170,232,238)_50%,_rgb(156,141,238)_79%,_rgb(190,131,253)_94%)] text-[#0D0D0D]',
        ghost:
         'bg-[#526264] text-[#FFFFFF] hover:bg-gradient-to-b to-[#1b495c] from-[#57bbce]',
        success:
          "bg-[linear-gradient(90deg,#8CC897_-20.7%,#44BC5A_18.76%,#1F5629_165.91%)]",
        // destructive:
        //   'bg-[#DA4747]  text-destructive-foreground shadow-sm hover:bg-destructive/90',
        // deleteDestructive: 'bg-[#8C2E2E] text-destructive-foreground shadow-sm',
        // outline:
        //   'rounded-lg border-[1px] border-foreground bg-card text-main shadow-lg dark:shadow-custom-dark hover:bg-[#7A87CC] dark:hover:bg-accent data-[active=true]:bg-[#7A87CC] data-[active=true]:text-[#FFF] hover:text-[#FFF] dark:data-[active=true]:bg-[#3E56D7]',
        // input:
        //   'border border-input bg-background data-[filled=true]:bg-[#FAFAFA] dark:bg-card dark:data-[filled=true]:bg-[#31333a] shadow-sm text-sm front-medium disabled:opacity-70',
        // secondary:
        //   'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        // ghost: 'hover:bg-accent hover:text-accent-foreground',
        // 'ghost-destructive':
        //   'hover:bg-destructive/10 text-destructive dark:hover:bg-destructive/40 dark:text-foreground',
        // link: 'text-primary underline-offset-4 hover:underline',
        // success: 'bg-[#55A541] text-white shadow hover:bg-opacity-80',
        // icon: 'hover:text-accent-foreground',
      },
      size: {
        default: 'h-8 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-8 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  active?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, active = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        disabled={props.disabled || props.isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        data-active={active}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
