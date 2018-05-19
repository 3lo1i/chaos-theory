import template from './logisticmap.pug';
import $ from 'jquery';

console.log('logisticmap module has loaded');

const title = 'Логистическое отображение';

const init = () => {
  console.log('logisticmap init');
  return $(template());
};

const destroy = () => {
  console.log('logisticmap destroyed');
};

export default { title, init, destroy };
