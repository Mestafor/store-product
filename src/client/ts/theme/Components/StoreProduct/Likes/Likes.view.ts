export class LikesView {

  private _$counts: NodeListOf<HTMLElement>;
  private _count: number;

  constructor(private _$like: HTMLElement) {
    this._$counts = this._$like.querySelectorAll<HTMLElement>('.product-likes__count');
    this._count = +(this._$like.dataset.count || 0);

    this._$like.addEventListener('click', this.onClick.bind(this));

    this._$counts.forEach($count => {
      $count.style.width = `${$count.clientWidth}px`;
    });
  }

  private onClick() {
    let counter;
    if (this._$like.classList.contains('product-likes--active')) {
      this._$like.classList.remove('product-likes--active');
      counter = this.decrement(this._count);
    }
    else {
      this._$like.classList.add('product-likes--active');
      counter = this.increment(this._count);
    }

    this._count = counter;

    this._$counts.forEach(count => {
      count.innerHTML = `${this._count}`;
    });

    // TODO: send request to increment or decrement product likes
    // Required fields: product_id
  }

  private increment(counter: number) {
    return ++counter;
  }

  private decrement(counter: number) {
    return --counter;
  }

}