import { cva, type VariantProps } from 'class-variance-authority';
import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface Props extends VariantProps<typeof styles> {
  pushTo: string;
  content: ReactNode | string;
  className?: string;
  disabled?: boolean;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  ariaLabel?: string;
}

export const NavigationButton = (props: Props) => {
  const {
    content,
    className,
    size,
    disabled = false,
    htmlType = 'button',
    pushTo,
    ariaLabel,
  } = props;

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <button
      disabled={disabled}
      onClick={() => navigate(pushTo)}
      type={htmlType}
      className={twMerge(
        styles({
          type: isPathSelected(location.pathname, pushTo) ? 'active' : 'transparent',
          size,
          disabled,
        }),
        className
      )}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
};

function isPathSelected(currentPathName: string, pushTo: string) {
  const root = currentPathName.split('/')[1];
  const pushLocationRoot = pushTo.split('/')[1];

  return root === pushLocationRoot;
}

const styles = cva(
  'select-none w-full flex flex-row justify-center items-center rounded-[6px] whitespace-nowrap cursor-pointer text-center',
  {
    variants: {
      type: {
        transparent: ['bg-transparent'],
        active: ['bg-bgSecondary'],
      },
      size: {
        md: ['py-[8px] text-base min-w-[38px]'],
      },
      disabled: {
        true: ['cursor-not-allowed'],
      },
    },

    defaultVariants: {
      type: 'transparent',
      size: 'md',
    },
  }
);
