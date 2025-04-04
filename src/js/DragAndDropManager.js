export class DragAndDropManager {
  constructor(resultContainer, selectedLetters) {
    this.container = resultContainer;
    this.selectedLetters = selectedLetters;
    this.draggedLetters = [];
    this.cursor = document.createElement('span');
    this.cursor.classList.add('text-cursor');
    this.isDragging = false;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.container.addEventListener('dragstart', (event) => {
      if (event.target.classList.contains('letter__selected')) {
        this.handleDragStart(event);
      }
    });

    this.container.addEventListener('dragover', (event) => {
      this.handleDragOver(event);
    });

    this.container.addEventListener('drop', (event) => {
      event.preventDefault();
      this.handleDrop(event);
    });

    this.container.addEventListener('dragend', () => {
      this.handleDragEnd();
    });
  }

  handleDragStart(event) {
    const selected = this.selectedLetters.getSelectedLetters();

    this.draggedLetters = selected.map(({ text, index }) => {
      const element = this.container.querySelector(`.letter[data-index="${index}"]`);
      return { text, index, element };
    });

    this.draggedLetters.sort((a, b) => a.index - b.index);

    event.dataTransfer.setData(
      'text/plain',
      JSON.stringify(this.draggedLetters.map(({ index }) => index)),
    );
    event.dataTransfer.effectAllowed = 'move';

    this.draggedLetters.forEach(({ element }) => {
      element.classList.add('dragging');
    });

    this.isDragging = true;
  }

  handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    let dropTarget = document.elementFromPoint(event.clientX, event.clientY);

    // Шукаємо найближчий елемент .letter
    while (dropTarget && dropTarget !== document.body && !dropTarget.classList.contains('letter')) {
      dropTarget = dropTarget.parentNode;
    }

    // Перевіряємо, чи ми знайшли правильний елемент
    if (!dropTarget || dropTarget.classList.contains('dragging')) return;

    const parent = dropTarget.parentNode;

    if (!parent || typeof parent.insertBefore !== 'function') {
      console.warn('Invalid parent for insertBefore:', parent);
      return;
    }

    // Додаємо курсор перед dropTarget
    if (!this.cursor.parentNode) {
      parent.insertBefore(this.cursor, dropTarget);
    } else if (this.cursor.nextSibling !== dropTarget) {
      parent.insertBefore(this.cursor, dropTarget);
    }
  }

  handleDrop(event) {
    let dropTarget = document.elementFromPoint(event.clientX, event.clientY);
    while (dropTarget && !dropTarget.classList.contains('letter')) {
      dropTarget = dropTarget.parentNode;
    }

    if (!dropTarget || dropTarget.classList.contains('dragging')) return;

    const parent = dropTarget.parentNode;

    this.draggedLetters.forEach(({ element }) => {
      parent.insertBefore(element, this.cursor);
    });

    this.cleanup();
  }

  handleDragEnd() {
    this.cleanup();
  }

  cleanup() {
    document.querySelectorAll('.dragging').forEach((el) => {
      el.classList.remove('dragging');
    });

    if (this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
    }

    this.isDragging = false;
    this.selectedLetters.clearSelection();
  }
}
