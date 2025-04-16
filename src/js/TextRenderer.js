export class TextRenderer {
  constructor(container, messageElement) {
    this.container = container;
    this.messageElement = messageElement;
  }

  render(value) {
    this.clear();
    if (!value.trim()) return;
    this.messageElement.textContent =
      'Press Ctrl (or Cmd on Mac) + click to multi-select or Ctrl (or Cmd on Mac) + drag to group select.';

    this.container.classList.remove('visually-hidden');
    value.split('').forEach((char, index) => {
      this.container.appendChild(this.createSpan(char, index));
    });
  }

  createSpan(char, index) {
    const span = document.createElement('span');
    span.innerText = char;
    span.classList.add('letter');
    span.dataset.index = index;
    return span;
  }

  clear() {
    this.container.innerHTML = '';
    this.container.classList.add('visually-hidden');
    this.messageElement.textContent = 'Enter text and click the "Display" button.';

    document.querySelectorAll('.dropped-outside').forEach((el) => {
      el.remove();
    });
  }
}
