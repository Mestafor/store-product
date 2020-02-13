// import { Maybe, elems as getElems } from 'm-library';
import LazyLoad from '.';

const lazyConfig = [
  {
    className: 'img.project-lazy-load-image',
    type: 'image',
  },
  {
    className: '.lazy-background',
    type: 'background-image',
  },
];

export default () =>
  lazyConfig.forEach(config => {
    const elems = Array.from(document.querySelectorAll(
      config.className
    ) as NodeListOf<HTMLElement>);
    if (elems.length > 0) {
      new LazyLoad({
        elems,
        type: config.type as any,
      });
    }
  });
