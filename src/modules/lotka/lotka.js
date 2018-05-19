import template from './lotka.pug';
import $ from 'jquery';

console.log('lotka module has loaded');

const title = 'Модель Лотки — Вольтерры';

const init = () => {
  console.log('lotka init');
  return $(template());
};

const destroy = () => {
  console.log('lotka destroyed');
};

export default { title, init, destroy };
