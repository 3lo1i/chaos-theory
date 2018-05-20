import template from './templates/logisticmap.pug';
import $ from 'jquery';
import Chart from 'chart.js';


console.log('logisticmap module has loaded');

const title = 'Логистическое отображение';

Chart.defaults.global.elements.line.tension = 0;
Chart.defaults.global.elements.line.borderWidth = 1;
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.point.hitRadius = 0;
Chart.defaults.global.elements.point.hoverRadius = 0;
Chart.defaults.global.hover.animationDuration = 0;
Chart.defaults.global.responsiveAnimationDuration = 0;
Chart.defaults.global.tooltips.enabled = false;
Chart.defaults.global.hover.mode = null;

const maxN = 400;
const curveN = 200;
const data = {
  a: 0.5,
  r: 3.0,
  m: 1,
};

const f = (x, r, m) => {
  let fx = r * x * (1.0 - x);
  for (let i = 1; i < m; i++) {
    fx = r * fx * (1.0 - fx);
  }
  return fx;
};

const rmessage = (r) => {
  if (r >= 0.0 && r <= 1.0) {
    return "0 < r < 1: популяция в конце концов вымрет, независимо от начальных условий.";
  } else if (r > 1.0 && r <= 2.0) {
    return "1 < r < 2: численность популяции быстро выйдет на стационарное значение (r−1)/r, независимо от начальных условий.";
  } else if (r > 2.0 && r <= 3.0) {
    return "2 < r < 3: численность популяции выйдет на стационарное значение (r−1)/r, но вначале будет колебаться вокруг него.";
  } else if (r > 3.0 && r <= 3.57) {
    return "3 < r < ~3.57: численность популяции будет бесконечно колебаться между 2, 4, 8, 16... значениями.";
  } else if (r > 3.57 && r <= 4.0) {
    return "3.57 < r < 4: хаотическое поведение.";
  }
  return '';
};


const init = () => {
  console.log('logisticmap init');

  const activity = $(template());

  const cobwebPoints = new Array(maxN * 2);
  const curvePoints = new Array(curveN);
  const cobwebChart = new Chart(activity.find('#cobwebchart'), {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'y=x',
          data: [{x: 0, y: 0}, {x: 1, y: 1}],
          fill: false,
          borderColor: 'green',
        },
        {
          label: 'y=rx(1-x)',
          data: curvePoints,
          fill: false,
          borderColor: 'blue',
        },
        {
          label: '(x₀;x₁), (x₁;x₁)...(xₙ;xₙ₊₁) xₙ₊₁=rxₙ(1-xₙ)',
          data: cobwebPoints,
          fill: false,
          borderColor: 'red',
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Паутинная диаграмма',
      },
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
            max: 1,
            beginAtZero: true,
            stepSize: 0.25,
          },
          scaleLabel: {
            display: true,
            labelString: 'x',
          },
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
            max: 1,
            beginAtZero: true,
            stepSize: 0.25,
          },
          scaleLabel: {
            display: true,
            labelString: 'y',
          },
        }],
      }
    }
  });
  const iterationsPoints = new Array(100);
  const iterationsChart = new Chart(activity.find('#iterationschart'), {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'xₙ',
          data: iterationsPoints,
          fill: false,
          borderColor: 'green',
        },
      ],  
    },
    options: {
      title: {
        display: true,
        text: 'Итерации',
      },
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
            max: 100,
            beginAtZero: true,
            stepSize: 25,
          },
          scaleLabel: {
            display: true,
            labelString: 'n',
          },
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
            max: 1,
            beginAtZero: true,
            stepSize: 0.25,
          },
          scaleLabel: {
            display: true,
            labelString: 'xₙ',
          },
        }],
      }
    }
  });
  const bifuractionchart = new Chart(activity.find('#bifuractionchart'), {
    type: 'scatter',
    data: {
      datasets: [
        // {
        //   label: 'r',
        //   data: [
        //     {x: 3.74, y: 0},
        //     {x: 3.74, y: 1}
        //   ],
        //   fill: false,
        //   borderColor: 'red',
        //   type: 'line',
        //   showLine: true,
        // },
        {
          label: 'Бифуркция',
          data: [],
          fill: false,
          showLine: false,
          pointRadius: 1,
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Бифуркационная диаграмма',
      },
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: {
            min: 2.8,
            max: 4.0,
            beginAtZero: true,
            stepSize: 0.3,
          },
          scaleLabel: {
            display: true,
            labelString: 'r',
          },
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            min: 0,
            max: 1,
            beginAtZero: true,
            stepSize: 0.25,
          },
          scaleLabel: {
            display: true,
            labelString: 'xₙ',
          },
        }],
      },
      animation: {
        duration: 0, // general animation time
      },
      hover: {
        animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
    }
  });

  const update = () => {
    const { a, r, m } = data;
    for (let i = 0; i <= curveN; ++i) {
      const x = i / (curveN - 1);
      const y = f(x, r, m);
      curvePoints[i] = {x, y};
    }

    let xn = a;
    let xn1 = 0.0;
    // const rxnPoints = [];
    for (let i = 0; i < maxN; ++i) {
      if (i <= 100) {
        iterationsPoints[i] = {x: i, y: xn};
      }
      // if (i > 100) {
      //   rxnPoints.push({x: r, y: xn});
      // }
      // cobweb steps
      const i2 = i * 2;
      cobwebPoints[i2] = {x: xn, y: xn1};
      xn1 = f(xn, r, m);
      cobwebPoints[i2 + 1] = {x: xn, y: xn1};
      xn = xn1;
    }
    // bifuractionchart.data.datasets[0].data = [
    //   {x: r, y: 0},
    //   {x: r, y: 1}
    // ];
    // bifuractionchart.update();
    cobwebChart.update();
    iterationsChart.update();

    activity.find('#logistic-map-message').text(rmessage(r));
  };

  const updateBifurcation = () => {
    const { m } = data;
    let total = 0;
    const bifurcationPoints = [];
    for (let r = 2.80; r <= 4.0; r += 0.003) {
      let xn = 0.5;
      let totalN = 300;
      if (r < 2.95) {
        totalN = 105;
      } else if (r < 3.0) {
        totalN = 110;
      } else if (r < 3.44) {
        totalN = 105;
      } else if (r < 3.46) {
        totalN = 110;
      } else if (r < 3.57) {
        totalN = 120;
      } else if (r < 3.82) {
        totalN = 200;
      } else if (r < 3.855) {
        totalN = 120;
      } else if (r < 3.995) {
        totalN = 200;
      } else {
        totalN = 110;
      }

      for (let n = 0; n < totalN; ++n) {
        xn = f(xn, r, m);
        if (n > 100) {
          bifurcationPoints.push({x: r, y: xn});
          total++;
        }
      }
    }
    bifuractionchart.data.datasets[0].data = bifurcationPoints;
    bifuractionchart.update();
  };


  activity.find('input[data-param]').on('input', (e) => {
    const { param } = e.target.dataset;
    const input = $(e.target);
    data[param] = parseFloat(input.val());
    update();
    if (param === 'm') {
      updateBifurcation();
    }
  });

  const saveImage = (filename, dataUrl) => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataUrl);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('download', filename);
    if (document.createEvent) {
      const evtObj = document.createEvent('MouseEvents');
      evtObj.initEvent('click', true, true);
      anchor.dispatchEvent(evtObj);
    } else if (anchor.click) {
      anchor.click();
    }
  };

  const saveChart = (chart, filename, width = 800, height = 800) => {
    const oldStyle = chart.canvas.parentNode.style;
    const oldClass = chart.canvas.parentNode.className;
    chart.canvas.parentNode.style.width = `${width}px`;
    chart.canvas.parentNode.style.height = `${height}px`;
    chart.canvas.parentNode.className = '';
    chart.resize();
    chart.render();
    const dataUrl = chart.toBase64Image('image/png');
    saveImage(filename, dataUrl);
    chart.canvas.parentNode.style = oldStyle;
    chart.canvas.parentNode.className = oldClass;
  };

  activity.find('#save-cobweb-btn').click((e) => {
    saveChart(cobwebChart, 'cobweb.png');
    e.preventDefault();
  });
  activity.find('#save-iterations-btn').click((e) => {
    iterationsChart.render();
    saveChart(iterationsChart, 'iterations.png');
    e.preventDefault();
  });
  activity.find('#save-bifurcation-btn').click((e) => {
    saveChart(bifuractionchart, 'bifurcation.png');
    e.preventDefault();
  });

  updateBifurcation();
  update();

  return activity;
};

const destroy = () => {
  console.log('logisticmap destroyed');
};

export default { title, init, destroy };
