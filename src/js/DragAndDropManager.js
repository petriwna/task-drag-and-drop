export class DragAndDropManager {
  constructor(resultContainer, selectedLetters) {
    this.container = resultContainer;
    this.selectedLetters = selectedLetters;
    this.draggedLetters = [];

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
  }

  handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const dropTarget = document.elementFromPoint(event.clientX, event.clientY);
    if (dropTarget && dropTarget.classList.contains('letter')) {
      dropTarget.classList.add('highlight'); // Підсвічує цільовий елемент
    }
  }

  handleDrop(event) {
    let dropTarget = document.elementFromPoint(event.clientX, event.clientY);

    while (dropTarget && !dropTarget.classList.contains('letter')) {
      dropTarget = dropTarget.parentNode;
    }

    if (!dropTarget || !dropTarget.parentNode) return;

    const parent = dropTarget.parentNode;

    this.draggedLetters.forEach(({ element }) => {
      parent.insertBefore(element, dropTarget.nextSibling);
      dropTarget = element;
    });

    this.draggedLetters = [];
    this.selectedLetters.clearSelection();
  }

  handleDragEnd() {
    document.querySelectorAll('.dragging').forEach((el) => {
      el.classList.remove('dragging');
    });

    document.querySelectorAll('.highlight').forEach((el) => {
      el.classList.remove('highlight');
    });
  }
}
