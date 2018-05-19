import template from './attractor.pug';
import $ from 'jquery';

console.log('attractor module has loaded');

const title = 'Аттрактор Лоренца';

const init = () => {
  console.log('attractor init');
  return $(template());
};

const destroy = () => {
  console.log('attractor destroyed');
};

export default { title, init, destroy };
