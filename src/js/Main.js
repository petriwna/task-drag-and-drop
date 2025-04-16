import { DragAndDropManager } from './DragAndDropManager';
import { SelectionManager } from './SelectionManager';
import { TextRenderer } from './TextRenderer';

export class Main {
  constructor() {
    this.button = document.querySelector('.button');
    this.textarea = document.querySelector('.input__control');
    this.resultContainer = document.querySelector('.result');
    this.message = document.querySelector('.message__text');
    this.message.textContent = 'Enter text and click the "Display" button.';

    this.setupEventListeners();

    this.textRenderer = new TextRenderer(this.resultContainer, this.message);
    this.selectionManager = new SelectionManager(this.resultContainer, this.message);
    new DragAndDropManager(this.resultContainer, this.selectionManager, this.message);
  }

  setupEventListeners() {
    this.button.addEventListener('click', this.handleButtonClick.bind(this));
  }

  handleButtonClick() {
    this.textRenderer.render(this.textarea.value);
    this.textarea.value = '';
  }
}
