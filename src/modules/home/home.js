import template from './home.pug';
import $ from 'jquery';

const init = () => {
  console.log('home init');
  return $(template());
};

const destroy = () => {
  console.log('home destroyed');
};

export default { init, destroy };
