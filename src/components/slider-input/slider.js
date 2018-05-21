import $ from 'jquery';

export default function init() {
  $(document)
    .on('input', 'input[data-param]', (e) => {
      const input = $(e.target);
      const { param } = e.target.dataset;
      const value = parseFloat(input.val());
      const step = parseFloat(input.attr('step'));
      const numberOfZeroes = Math.max(Math.log10(1 / step), 0);
      $(`[data-bind="${ param }"]`).text(value.toFixed(numberOfZeroes));
    });
};
