import { ProjectInput } from './components/ProjectInput.js';
import { ProjectList } from './components/ProjectList.js';

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
