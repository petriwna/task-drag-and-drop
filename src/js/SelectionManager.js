export class SelectionManager {
  constructor(resultContainer) {
    this.container = resultContainer;

    this.selectedLetters = [];
    this.selectionBox = null;
    this.startX = 0;
    this.startY = 0;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.container.addEventListener('mousedown', (event) => this.handleMouseDown(event));
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event));
    document.addEventListener('mouseup', (event) => this.handleMouseUp(event));
  }

  handleMouseDown(event) {
    if (event.ctrlKey || event.metaKey) {
      this.toggleLetterSelection(event.target);
      this.startSelectionBox(event);
    }
  }

  toggleLetterSelection(letter) {
    if (!letter.classList.contains('letter')) return;

    const letterIndex = this.getLetterIndex(letter);
    const existing = this.selectedLetters.find((item) => item.index === letterIndex);

    if (existing) {
      this.selectedLetters = this.selectedLetters.filter((item) => item.index !== letterIndex);
      letter.classList.remove('letter__selected');
    } else {
      this.selectedLetters.push({ text: letter.innerText, index: letterIndex, element: letter });
      letter.classList.add('letter__selected');
    }
  }

  startSelectionBox(event) {
    this.clearSelection();
    this.selectionBox = document.createElement('div');
    this.selectionBox.classList.add('selection-box');
    document.body.appendChild(this.selectionBox);

    this.startX = event.clientX;
    this.startY = event.clientY;

    this.updateSelectionBoxPosition(event);
  }

  handleMouseMove(event) {
    if (!this.selectionBox) return;
    this.updateSelectionBoxPosition(event);
    this.updateLetterSelection();
  }

  handleMouseUp() {
    if (this.selectionBox) {
      document.body.removeChild(this.selectionBox);
      this.selectionBox = null;
    }
  }

  updateSelectionBoxPosition(event) {
    const width = event.clientX - this.startX;
    const height = event.clientY - this.startY;

    Object.assign(this.selectionBox.style, {
      width: `${Math.abs(width)}px`,
      height: `${Math.abs(height)}px`,
      left: `${Math.min(event.clientX, this.startX)}px`,
      top: `${Math.min(event.clientY, this.startY)}px`,
    });
  }

  updateLetterSelection() {
    const rect = this.selectionBox.getBoundingClientRect();

    this.container.querySelectorAll('.letter').forEach((letter) => {
      const letterIndex = this.getLetterIndex(letter);
      const letterRect = letter.getBoundingClientRect();

      const isInside =
        letterRect.left >= rect.left &&
        letterRect.right <= rect.right &&
        letterRect.top >= rect.top &&
        letterRect.bottom <= rect.bottom;

      if (isInside) {
        if (!this.selectedLetters.some((item) => item.index === letterIndex)) {
          letter.classList.add('letter__selected');
          this.selectedLetters.push({
            text: letter.innerText,
            index: letterIndex,
            element: letter,
          });
        }
      } else {
        letter.classList.remove('letter__selected');
        this.selectedLetters = this.selectedLetters.filter((item) => item.index !== letterIndex);
      }
    });
  }

  getLetterIndex(letter) {
    return parseInt(letter.dataset.index, 10);
  }

  clearSelection() {
    this.selectedLetters.forEach(({ element }) => element.classList.remove('letter__selected'));
    this.selectedLetters = [];
  }

  getSelectedLetters() {
    return [...this.selectedLetters];
  }
}
