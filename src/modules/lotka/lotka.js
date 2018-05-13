import template from './lotka.pug';
import $ from 'jquery';

console.log('lotka module has loaded');

const init = () => {
  console.log('lotka init');
  return $(template());
};

const destroy = () => {
  console.log('lotka destroyed');
};

export default { init, destroy };
