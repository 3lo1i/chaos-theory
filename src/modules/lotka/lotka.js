import template from './lotka.pug';
import $ from 'jquery';
import Chart from 'chart.js';
import { saveChart } from '../../utils/save-utils';

console.log('lotka module has loaded');

const title = 'Модель Лотки — Вольтерры';

const data = {
  prey: 0.5,
  pred: 0.5,
  a: 0.25,
  b: 0.5,
  c: 0.13,
  d: 0.2,
};

const predatorSeries = [];
const preySeries = [];

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
            max: 100
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

  const updateLotkaChart = () => {
    const {pred, prey, a, b, c, d} = data;
    let predatorNumber = pred;
    let preyNumber = prey;
    for (let i = 0; i < 101; i++) {
      predatorNumber = Math.max(predatorNumber, 0);
      preyNumber = Math.max(preyNumber, 0);
      predatorSeries[i] = {x: i, y: predatorNumber};
      preySeries[i] = {x: i, y: preyNumber};
      let preySpeed = (a - b * predatorNumber) * preyNumber;
      let predatorSpeed = (-c + d * preyNumber) * predatorNumber;
      predatorNumber += predatorSpeed;
      preyNumber += preySpeed;
    }
    lotkaChart.update();
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

  updateLotkaChart();

  return activity;
};

const destroy = () => {
  console.log('lotka destroyed');
};

export default { title, init, destroy };
