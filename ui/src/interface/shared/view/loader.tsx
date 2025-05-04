import { VariantProps, cva } from 'class-variance-authority';
import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const BaseLoader = ({
  size,
  color,
  className,
}: VariantProps<typeof styles> & { className?: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <m.div
      hidden={!show}
      className={twMerge(styles({ size, color }), className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.18,
        ease: 'easeIn',
      }}
    />
  );
};

const styles = cva(
  'animate-spin inline-block self-center border-current border-t-transparent rounded-full m-0',
  {
    variants: {
      color: {
        blue: ['text-[#238BE6]'],
        white: ['text-zinc-200'],
      },
      size: {
        sm: ['h-[0.9rem] w-[0.9rem] border-[1.7px]'],
        md: ['h-4 w-4 border-[2px]'],
        lg: ['h-7 w-7 border-[2px]'],
      },
    },
    defaultVariants: {
      color: 'blue',
      size: 'md',
    },
  }
);
