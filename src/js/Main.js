import { DragAndDropManager } from './DragAndDropManager';
import { SelectionManager } from './SelectionManager';
import { TextRenderer } from './TextRenderer';

export class Main {
  constructor() {
    this.button = document.querySelector('.button');
    this.textarea = document.querySelector('.input__control');
    this.resultContainer = document.querySelector('.result');

    this.setupEventListeners();

    this.textRenderer = new TextRenderer(this.resultContainer);
    this.selectionManager = new SelectionManager(this.resultContainer);
    new DragAndDropManager(this.resultContainer, this.selectionManager);
  }

  setupEventListeners() {
    this.button.addEventListener('click', this.handleButtonClick.bind(this));
  }

  handleButtonClick() {
    this.textRenderer.render(this.textarea.value);
    this.textarea.value = '';
  }
}
