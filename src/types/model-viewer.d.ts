import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          'loading'?: 'auto' | 'lazy' | 'eager';
          'reveal'?: 'auto' | 'interaction' | 'manual';
          'camera-controls'?: boolean | string;
          'auto-rotate'?: boolean | string;
          'ar'?: boolean | string;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          'exposure'?: string;
          'environment-image'?: string;
          'skybox-image'?: string;
          'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
          'touch-action'?: string;
          tabIndex?: number;
          ref?: React.Ref<any>;
        },
        HTMLElement
      >;
    }
  }
}

