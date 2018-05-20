import $ from 'jquery';

export default function init() {
  $(document)
    .on('input', 'input[data-param]', (e) => {
      const input = $(e.target);
      const { param } = e.target.dataset;
      const value = parseFloat(input.val());
      $(`[data-bind="${ param }"]`).text(value.toFixed(2));
    });
};
