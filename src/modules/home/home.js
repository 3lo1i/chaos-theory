import template from './home.pug';
import $ from 'jquery';

const title = 'Выберите категорию:';

const init = () => {
  console.log('home init');
  return $(template());
};

const destroy = () => {
  console.log('home destroyed');
};

export default { title, init, destroy };
