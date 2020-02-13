/**
 * Simple Event subscriber
 * HOWTO:
 * eventSubscriber.add('name', (param1, param2, ...) => { console.log(param1, param2, ...) })
 * eventSubscriber.dispatch('name', param1, param2);
 */

// Dependencies
import Observer from './Observer';

class EventSubscriber extends Observer {
  // load
  // resize
  // DOMContentLoaded
  // scroll
  private events: { [event: string]: Function[] } = {};

  add<T>(event: string, fn: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  remove(event: string, fn: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(func => func !== fn);
    }
  }

  dispatch(event: string, ...args) {
    if (Array.isArray(this.events[event]) && this.events[event].length > 0) {
      this.events[event].forEach(fn => {
        if (typeof fn === 'function') {
          fn(...args);
        }
      });
    }
  }
}

export default new EventSubscriber();
