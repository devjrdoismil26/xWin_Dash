import React from 'react';
/**
 * Slider Component - Componente de controle deslizante
 *
 * @module components/ui/slider
 * @since 1.0.0
 */

import * as React from "react";

interface SliderProps {
  value?: number;
  onChange?: (e: any) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value = 0, onChange, min = 0, max = 100, step = 1, className = "" }, ref) => {
    return (
              <input
        ref={ ref }
        type="range"
        value={ value }
        onChange={ (e) => onChange?.(Number(e.target.value)) }
        min={ min }
        max={ max }
        step={ step }
        className={className } />);

  });

Slider.displayName = "Slider";

export default Slider;
export { Slider };
