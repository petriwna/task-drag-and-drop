export class TextRenderer {
  constructor(container) {
    this.container = container;
  }

  render(value) {
    this.clear();
    if (!value.trim()) return;

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
  }
}
