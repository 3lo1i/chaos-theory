import template from './lotka.pug';
import $ from 'jquery';
import Chart from 'chart.js';
import { saveChart } from '../../utils/save-utils';

console.log('lotka module has loaded');

const title = 'Модель Лотки — Вольтерры';

const data = {
  prey: 0.8,
  pred: 0.8,
  a: 2 / 3,
  b: 4 / 3,
  c: 1,
  d: 1,
};

const seriesLength = 501;
const dt = 0.001;
const iterationsPerStep = 100;
const predatorSeries = [];
const preySeries = [];
const phaseSeries = [];

const f = (data, x, y) => {
  const {a, b, c, d} = data;
  const preyDelta = dt * (a * x - b * x * y);
  const predatorDelta = dt * (c * x * y - d * y);
  return {predatorDelta, preyDelta};
};

const init = () => {
  Chart.defaults.global.elements.line.tension = 0.5;
  Chart.defaults.global.elements.line.borderWidth = 2;
  Chart.defaults.global.elements.point.radius = 0;
  Chart.defaults.global.elements.point.hitRadius = 0;
  Chart.defaults.global.elements.point.hoverRadius = 0;
  Chart.defaults.global.hover.animationDuration = 0;
  Chart.defaults.global.responsiveAnimationDuration = 0;
  Chart.defaults.global.tooltips.enabled = false;
  Chart.defaults.global.hover.mode = null;

  console.log('lotka init');
  const activity = $(template());

  const lotkaChart = new Chart(activity.find('#lotkachart'), {
    type: 'line',
    data: {
      datasets: [{
        label: 'Число хищников',
        data: predatorSeries,
        fill: false,
        borderColor: 'red'
      }, {
        label: 'Число жертв',
        data: preySeries,
        fill: false,
        borderColor: 'green'
      }]
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
            max: seriesLength - 1
          },
          scaleLabel: {
            display: true,
            labelString: 'Время'
          }
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            min: 0
          },
          scaleLabel: {
            display: true,
            labelString: 'Популяция'
          }
        }]
      },
      legend: {
      }
    }
  });
  const phaseChart = new Chart(activity.find('#phasechart'), {
    type: 'line',
    data: {
      datasets: [{
        data: phaseSeries,
        fill: false,
        borderColor: 'blue',
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Фазовый портрет',
      },
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
          },
          scaleLabel: {
            display: true,
            labelString: 'Число жертв'
          }
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
          },
          scaleLabel: {
            display: true,
            labelString: 'Число хищников'
          }
        }]
      },
      animation: {
        duration: 0,
      },
      legend: {
        display: false,
      },
    }
  });

  const updateLotkaChart = () => {
    const {pred, prey, a, b, c, d} = data;
    console.log(data);
    let predatorNumber = pred;
    let preyNumber = prey;
    let preatorExtinct = predatorNumber === 0;
    let preyExtinct = preyNumber === 0;
    for (let i = 0; i < seriesLength; i++) {
      predatorSeries[i] = {x: i, y: predatorNumber};
      preySeries[i] = {x: i, y: preyNumber};
      phaseSeries[i] = {x: preyNumber, y: predatorNumber};
      for (let j = 0; j < iterationsPerStep; j++) {
        predatorNumber = preatorExtinct ? 0 : Math.max(predatorNumber, 0);
        preyNumber = preyExtinct ? 0 : Math.max(preyNumber, 0);
        preatorExtinct = predatorNumber === 0;
        preyExtinct = preyNumber === 0;
        const {predatorDelta, preyDelta} = f(data, preyNumber, predatorNumber);
        predatorNumber += predatorDelta;
        preyNumber += preyDelta;
      }
      if (preatorExtinct && preyExtinct) {
        predatorSeries.length = i + 1;
        preySeries.length = i + 1;
        phaseSeries.length = i + 1;
        break;
      }
    }
    phaseChart.update();
    lotkaChart.update();
  };

  const deserializeForm = () => {
    Object.entries(data).forEach(([key, value]) => {
      activity.find(`input[data-param=${key}]`).val(value);
      activity.find(`[data-bind=${key}]`).text(value.toFixed(2));
    });
  };

  activity.find('input[data-param]').on('input', (e) => {
    const { param } = e.target.dataset;
    const input = $(e.target);
    data[param] = parseFloat(input.val());
    updateLotkaChart();
  });

  activity.find('#save-chart-btn').click((e) => {
    saveChart(lotkaChart, 'preadator-prey.png', 1000, 800);
    e.preventDefault();
  });
  activity.find('#save-phase-btn').click((e) => {
    saveChart(phaseChart, 'lotka-phase.png', 800, 800);
    e.preventDefault();
  });

  deserializeForm();
  updateLotkaChart();

  return activity;
};

const destroy = () => {
  console.log('lotka destroyed');
};

export default { title, init, destroy };
