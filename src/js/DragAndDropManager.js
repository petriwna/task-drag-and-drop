import { CursorManager } from './CursorManager';

export class DragAndDropManager {
  constructor(resultContainer, selectedLettersManager) {
    this.container = resultContainer;
    this.selectedLettersManager = selectedLettersManager;

    this.draggedLetters = [];
    this.cursorManager = new CursorManager();

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.container.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.container.addEventListener('dragover', this.handleDragOver.bind(this));
    this.container.addEventListener('drop', this.handleDrop.bind(this));
    this.container.addEventListener('dragend', this.handleDragEnd.bind(this));
  }

  handleDragStart(event) {
    if (!event.target.classList.contains('letter__selected')) return;

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
    this.draggedLetters.forEach(({ element }) => {
      parent.insertBefore(element, this.cursorManager.getCursor());
    });

    this.cleanup();
  }

  handleDragEnd() {
    this.cleanup();
  }

  cleanup() {
    this.container.querySelectorAll('.dragging').forEach((el) => el.classList.remove('dragging'));

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
