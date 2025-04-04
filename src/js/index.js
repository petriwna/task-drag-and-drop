import '../styles/main.css';

import { Main } from './Main';

export function init() {
  new Main();
}

document.addEventListener('DOMContentLoaded', init);
