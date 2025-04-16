import { CursorManager } from './CursorManager';

export class DragAndDropManager {
  constructor(resultContainer, selectedLettersManager, messageElement) {
    this.container = resultContainer;
    this.selectedLettersManager = selectedLettersManager;
    this.messageElement = messageElement;

    this.draggedLetters = [];
    this.cursorManager = new CursorManager();

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.body.addEventListener('dragstart', this.handleDragStart.bind(this));
    document.body.addEventListener('dragover', this.handleDragOver.bind(this));
    document.body.addEventListener('drop', this.handleDrop.bind(this));
    document.body.addEventListener('dragend', this.handleDragEnd.bind(this));
  }

  handleDragStart(event) {
    if (!event?.target?.classList?.contains('letter__selected')) {
      this.messageElement.textContent =
        'To select, press Ctrl (or Cmd on Mac) + click to multi-select or Ctrl (or Cmd on Mac) + drag to group select.';
    }

    const selected = this.selectedLettersManager.getSelectedLetters();

    this.draggedLetters = selected
      .map(({ index }) => {
        const element = this.container.querySelector(`.letter[data-index="${index}"]`);
        return element ? { index, element } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.index - b.index);

    if (this.draggedLetters.length === 0) return;

    event.dataTransfer.setData(
      'text/plain',
      JSON.stringify(this.draggedLetters.map(({ index }) => index)),
    );
    event.dataTransfer.effectAllowed = 'move';

    this.draggedLetters.forEach(({ element }) => element.classList.add('dragging'));
  }

  handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const dropTarget = this.findLetterFromPoint(event.clientX, event.clientY);
    if (!dropTarget || dropTarget.classList.contains('dragging')) return;

    this.cursorManager.placeBefore(dropTarget);
  }

  handleDrop(event) {
    event.preventDefault();

    const dropTarget = this.findLetterFromPoint(event.clientX, event.clientY);
    if (!dropTarget || dropTarget.classList.contains('dragging')) return;

    const parent = dropTarget.parentNode;
    if (parent.classList.contains('result')) {
      this.draggedLetters.forEach(({ element }) => {
        parent.insertBefore(element, this.cursorManager.getCursor());
      });
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

  handleDragEnd() {
    this.cleanup();
  }

  cleanup() {
    document.querySelectorAll('.dragging').forEach((el) => el.classList.remove('dragging'));

    this.cursorManager.remove();
    this.selectedLettersManager.clearSelection();
  }

  findLetterFromPoint(x, y) {
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.body && !el.classList.contains('letter')) {
      el = el.parentNode;
    }
    return el;
  }
}
