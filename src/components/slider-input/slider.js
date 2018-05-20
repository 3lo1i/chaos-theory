import $ from 'jquery';

export default function init() {
  $(document)
    .on('input', 'input[data-param]', (e) => {
      const input = $(e.target);
      const { param } = e.target.dataset;
      $(`[data-bind="${ param }"]`).text(input.val());
    });
};
