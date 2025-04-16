import { DragAndDropManager } from './DragAndDropManager';
import { SelectionManager } from './SelectionManager';
import { TextRenderer } from './TextRenderer';

export class Main {
  constructor() {
    this.button = document.querySelector('.button');
    this.textarea = document.querySelector('.input__control');
    this.resultContainer = document.querySelector('.result');
    this.message = document.querySelector('.message__text');

    this.textRenderer = new TextRenderer(this.resultContainer, this.message);
    this.selectionManager = new SelectionManager(this.message);
    this.dragAndDropManager = new DragAndDropManager(this.selectionManager, this.message);

    this.initializeMessage();
    this.setupEventListeners();
  }

  initializeMessage() {
    this.message.textContent = 'Enter text and click the "Display" button.';
  }

  setupEventListeners() {
    this.button.addEventListener('click', this.handleButtonClick.bind(this));
  }

  handleButtonClick() {
    this.textRenderer.render(this.textarea.value);
    this.textarea.value = '';
  }
}
