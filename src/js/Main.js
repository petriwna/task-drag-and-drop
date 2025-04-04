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
    this.button.addEventListener('click', () => this.handleButtonClick());

    // this.resultContainer.addEventListener('dragstart', (event) => {
    //   event.dataTransfer.setData('application/my-app', event.target.id);
    //   event.dataTransfer.effectAllowed = 'move';
    //   console.log('start', event);
    // });
    //
    // this.resultContainer.addEventListener('dragover', (event) => {
    //   event.preventDefault();
    //   console.log('over', event);
    // });
    //
    // this.resultContainer.addEventListener('drop', (event) => {
    //   event.preventDefault();
    //   console.log('drop', event);
    // });
  }

  handleButtonClick() {
    this.textRenderer.render(this.textarea.value);
    this.textarea.value = '';

    // this.selectionManager.clearSelection();
  }
}
