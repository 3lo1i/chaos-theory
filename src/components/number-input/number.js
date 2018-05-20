import $ from 'jquery';

export default function init() {
  $(document)
    .on('click', '.btn[data-action="increment"], .btn[data-action="decrement"]',
      (event) => {
        const { target, action, step } = event.target.dataset;
        const input = $(target);
        const min = parseInt(input.attr('min'));
        const max = parseInt(input.attr('max'));
        const val = parseInt(input.val());
        const stp = parseInt(step);
        if (action === 'increment') {
          input.val(Math.min(val + stp, max));
        } else if (action === 'decrement') {
          input.val(Math.max(val - stp, min));
        }
        input.trigger('input');
        input.change();
        event.preventDefault();
      });
  // prevent form submit on enter
  $(document)
    .on('keydown', 'input', (e) => {
      if (e.keyCode == 13) {
        if (e.target.tagName === 'INPUT') {
          $(e.target).change();
        }
        e.preventDefault();
      }
    });
};
