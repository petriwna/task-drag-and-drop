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
    this.container.addEventListener('mousedown', (event) => this.startSelection(event));
    document.addEventListener('mousemove', (event) => this.drawSelectionBox(event));
    document.addEventListener('mouseup', (event) => this.stopSelection(event));
  }

  startSelection(event) {
    if (event.ctrlKey || event.metaKey) {
      this.toggleLetterSelection(event.target);
      this.createSelectionBox(event);
    }
  }

  toggleLetterSelection(letter) {
    if (!letter.classList.contains('letter')) return;

    const letterText = letter.innerText;
    const letterIndex = Array.from(letter.parentNode.children).indexOf(letter);

    letter.classList.toggle('letter__selected');

    if (letter.classList.contains('letter__selected')) {
      this.selectedLetters.push({ text: letterText, index: letterIndex, element: letter });
    } else {
      this.selectedLetters = this.selectedLetters.filter(
        (item) => !(item.text === letterText && item.index === letterIndex),
      );
    }
  }

  clearSelection() {
    this.selectedLetters.forEach((letter) => {
      setTimeout(() => {
        letter.element.classList.remove('letter__selected');
      }, 100);
    });

    this.selectedLetters = [];
  }

  drawSelectionBox(event) {
    if (!this.selectionBox) return;
    const width = event.clientX - this.startX;
    const height = event.clientY - this.startY;
    this.selectionBox.style.width = `${Math.abs(width)}px`;
    this.selectionBox.style.height = `${Math.abs(height)}px`;
    this.selectionBox.style.left = `${Math.min(event.clientX, this.startX)}px`;
    this.selectionBox.style.top = `${Math.min(event.clientY, this.startY)}px`;
    this.updateLetterSelection();
  }

  createSelectionBox(event) {
    this.selectionBox = document.createElement('div');
    this.selectionBox.classList.add('selection-box');
    document.body.appendChild(this.selectionBox);
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.selectionBox.style.left = `${this.startX}px`;
    this.selectionBox.style.top = `${this.startY}px`;
  }

  updateLetterSelection() {
    const rect = this.selectionBox.getBoundingClientRect();

    document.querySelectorAll('.letter').forEach((letter) => {
      const letterText = letter.innerText;
      const letterIndex = Array.from(letter.parentNode.children).indexOf(letter);

      const letterRect = letter.getBoundingClientRect();
      const isInside =
        letterRect.left >= rect.left &&
        letterRect.right <= rect.right &&
        letterRect.top >= rect.top &&
        letterRect.bottom <= rect.bottom;
      if (isInside) {
        if (
          !this.selectedLetters.some(
            (item) => item.text === letterText && item.index === letterIndex,
          )
        ) {
          letter.classList.add('letter__selected');
          this.selectedLetters.push({ text: letterText, index: letterIndex, element: letter });
        }
      } else {
        this.selectedLetters = this.selectedLetters.filter(
          (item) => !(item.text === letterText && item.index === letterIndex),
        );
        letter.classList.remove('letter__selected');
      }
    });
  }

  stopSelection() {
    if (this.selectionBox) {
      document.body.removeChild(this.selectionBox);
      this.selectionBox = null;
    }
  }

  getSelectedLetters() {
    return this.selectedLetters;
  }
}
