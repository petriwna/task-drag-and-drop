import { CursorManager } from './CursorManager';

export class DragAndDropManager {
  constructor(selectionManager, messageElement) {
    this.selectionManager = selectionManager;
    this.messageElement = messageElement;
    this.cursorManager = new CursorManager();

    this.draggedLetters = [];

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.body.addEventListener('dragstart', this.handleDragStart.bind(this));
    document.body.addEventListener('dragover', this.handleDragOver.bind(this));
    document.body.addEventListener('drop', this.handleDrop.bind(this));
    document.body.addEventListener('dragend', this.handleDragEnd.bind(this));
  }

  handleDragStart(event) {
    const selected = this.selectionManager.getSelectedLetters();

    if (selected.length === 0 || !event.target.classList.contains('letter__selected')) {
      this.messageElement.textContent =
        'To select, press Ctrl (or Cmd on Mac) + click to multi-select or Ctrl (or Cmd on Mac) + drag to group select.';

      return;
    }

    this.draggedLetters = selected
      .map(({ element }) => ({ element }))
      .sort((a, b) => {
        return parseInt(a.element.dataset.index) - parseInt(b.element.dataset.index);
      });

    event.dataTransfer.setData('text/plain', '');
    event.dataTransfer.effectAllowed = 'move';

    this.draggedLetters.forEach(({ element }) => element.classList.add('dragging'));
  }

  handleDragOver(event) {
    event.preventDefault();

    const dropTarget = this.findLetterFromPoint(event.clientX, event.clientY);
    if (dropTarget && !dropTarget.classList.contains('dragging')) {
      this.cursorManager.placeBefore(dropTarget);
    }
  }

  handleDrop(event) {
    event.preventDefault();

    const dropTarget = this.findLetterFromPoint(event.clientX, event.clientY);
    if (!dropTarget || dropTarget.classList.contains('dragging')) return;

    const parent = dropTarget.parentNode;
    if (!parent || !this.draggedLetters.length) return;

    if (parent.classList.contains('result') || parent.classList.contains('dropped-outside')) {
      if (this.draggedLetters.length === 1) {
        this.swapLetters(dropTarget, this.draggedLetters[0].element);
      } else {
        this.draggedLetters.forEach(({ element }) => {
          parent.insertBefore(element, this.cursorManager.getCursor());
        });
      }
    } else {
      const div = document.createElement('div');
      div.classList.add('dropped-outside');

      this.draggedLetters.forEach(({ element }) => {
        const rect = element.getBoundingClientRect();
        div.style.left = `${event.clientX - rect.width / 2}px`;
        div.style.top = `${event.clientY - rect.height / 2}px`;
        element.removeAttribute('draggable');

        div.appendChild(element);
      });
      document.body.appendChild(div);
    }

    this.cleanup();
  }

  swapLetters(letterA, letterB) {
    if (letterA === letterB) return;

    const parentA = letterA.parentNode;
    const parentB = letterB.parentNode;

    const placeholderA = document.createElement('span');
    const placeholderB = document.createElement('span');

    parentA.replaceChild(placeholderA, letterA);
    parentB.replaceChild(placeholderB, letterB);

    parentA.replaceChild(letterB, placeholderA);
    parentB.replaceChild(letterA, placeholderB);
  }

  handleDragEnd() {
    this.cleanup();
  }

  cleanup() {
    document.querySelectorAll('.dragging').forEach((el) => el.classList.remove('dragging'));
    this.cursorManager.remove();
    this.selectionManager.clearSelection();
    this.draggedLetters = [];
  }

  findLetterFromPoint(x, y) {
    let el = document.elementFromPoint(x, y);
    while (el && !el.classList.contains('letter') && el !== document.body) {
      el = el.parentNode;
    }
    return el;
  }
}
