import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mantine/core';
import { PropsWithoutRef, ReactNode } from 'react';
import { ForwardedRef, forwardRef } from 'react';
import { FormProvider, useForm, type UseFormProps } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { z, type ZodType } from 'zod';
import { BaseLoader } from './loader';

export const FORM_ERROR = 'FORM_ERROR';

export interface OnSubmitResult {
  FORM_ERROR?: string;
  [prop: string]: unknown;
}

export interface FormProps<S extends z.ZodType<any, any>>
  extends OmitStrict<PropsWithoutRef<JSX.IntrinsicElements['form']>, 'onSubmit'> {
  schema: S;
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>;
  isLoading?: boolean;

  errorMessage?: string | null | undefined;
  submitText?: string | undefined;
  initialValues?: UseFormProps<z.infer<S>>['defaultValues'];
  leftSubmitSlot?: ReactNode;

  children?: ReactNode | undefined;
}

function FormElement<S extends ZodType<any, any>>(
  {
    schema,
    onSubmit,
    errorMessage,
    submitText,
    children,
    isLoading,
    className,
    leftSubmitSlot,
    ...props
  }: FormProps<S>,
  ref: ForwardedRef<HTMLFormElement>
) {
  const ctx = useForm<z.infer<S>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const handleSubmit = ctx.handleSubmit(async (values) => {
    await onSubmit(values).catch(null);
  });

  return (
    <FormProvider {...ctx}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={twMerge('flex flex-col gap-4', className)}
        {...props}
      >
        {children}

        {submitText ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-row items-center justify-between mt-2 w-full">
              {leftSubmitSlot}
              <Button
                type="submit"
                size="sm"
                classNames={{
                  root: 'min-w-[70px] w-[30%] self-end ml-auto',
                }}
              >
                {isLoading ? <BaseLoader color="white" size="md" /> : submitText}
              </Button>
            </div>

            <Error message={errorMessage} />
          </div>
        ) : null}
      </form>
    </FormProvider>
  );
}

export const Form = forwardRef(FormElement) as <S extends ZodType<any, any>>(
  props: FormProps<S> & { ref?: ForwardedRef<HTMLFormElement> }
) => ReturnType<typeof FormElement>;

export const Error = ({ message }: { message?: string | null | undefined }) => {
  if (!message) return null;

  return (
    <span className="w-full mt-4 text-base text-danger px-[2px] py-[10px]">{message}</span>
  );
};
