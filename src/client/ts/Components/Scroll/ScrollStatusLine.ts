interface IScrollStatusLine {
  elem: HTMLElement;
}

export class ScrollStatusLine {
  private _elem: HTMLElement;

  constructor(obj: IScrollStatusLine) {
    this._elem = obj.elem;
  }

  draw({ scrollTop, scrollHeight, height }) {
    const width = scrollTop / (scrollHeight - height);

    this._elem.style.cssText = `
      -webkit-transform: scale(${width}, 1) translateZ(0);
      transform: scale(${width}, 1) translateZ(0);
    `;
  }
}
