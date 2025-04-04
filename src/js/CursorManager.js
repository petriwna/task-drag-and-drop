export class CursorManager {
  constructor() {
    this.cursor = this.createCursor();
  }

  createCursor() {
    const span = document.createElement('span');
    span.classList.add('text-cursor');
    return span;
  }

  placeBefore(target) {
    const parent = target.parentNode;
    if (!parent || typeof parent.insertBefore !== 'function') return;

    if (!this.cursor.parentNode || this.cursor.nextSibling !== target) {
      parent.insertBefore(this.cursor, target);
    }
  }

  remove() {
    if (this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
    }
  }

  getCursor() {
    return this.cursor;
  }
}
