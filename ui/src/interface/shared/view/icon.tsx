import { DetailedHTMLProps, HTMLAttributes, memo } from 'react';
import { IconName } from '../types/common';

interface Props extends DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement> {
  name: IconName;
  section?: string;
  width?: string;
  height?: string;
}

export const Icon = memo((props: Props) => {
  const { name, section = 'primary', width, height, ...other } = props;

  return (
    <svg {...other} data-testid="icon_svg">
      <use
        data-testid="icon_svg_use"
        width={width}
        height={height}
        xlinkHref={`/icons/${section}.svg#${name.toLocaleLowerCase()}`}
      />
    </svg>
  );
});
