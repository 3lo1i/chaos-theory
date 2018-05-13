import 'bootstrap';
import './scss/style.scss';
import $ from 'jquery';
// import attractor from './modules/attractor/attractor';
// import logisticmap from './modules/logisticmap/logisticmap';
// import lotka from './modules/lotka/lotka';
// import lsystem from './modules/lsystem/lsystem';
import home from './modules/home/home';


// activities are independent modules that populate page's main content.
const activities = {
  'attractor': null,
  'logisticmap': null,
  'lotka': null,
  'lsystem': null,
  'home': home,
};


/**
 * Change current activity.
 * @param {string} activityName - a name of activity to go to. Must be one of activities object keys.
 * @param {boolean} force - reinitialize activity even if it's already current activiy.
 */
const changeActivity = (() => {
  // use closure so we don't have to store mutable currentActivity in global scope.
  let currentActivity = '';
  const initActivity = (activityName, loadedModule = null) => {
    if (loadedModule) {
      activities[activityName] = loadedModule.default;
    }
    // clear all main's content and populate with activity's content
    $('#activity-content').empty();
    $('#activity-content').append(activities[activityName].init());
    // show currently selected activity link as active
    $(`.category-link:not([href="#${ activityName }"])`).removeClass('active');
    $(`.category-link[href="#${ activityName }"]`).addClass('active');
    // always set current tab to 'model'
    $('#activity-tabs-select a[href="#activity-tab-model"]').tab('show');
    // disable tabs if there is no content to show
    $('#activity-tabs-select a[href="#activity-tab-code"]')
      .toggleClass('disabled', !$('#activity-tab-code').length);
    $('#activity-tabs-select a[href="#activity-tab-help"]')
      .toggleClass('disabled', !$('#activity-tab-help').length);
  };
  return (activityName, force = false) => {    
    if (!activities.hasOwnProperty(activityName)) {
      return;
    }
    if (!force && activityName === currentActivity) {
      return;
    }
    if (currentActivity && activities[currentActivity]) {
      activities[currentActivity].destroy();
    }
    currentActivity = activityName;
    if (!activities[activityName] || force) {
      if (activityName === 'attractor') {
        import(
          /* webpackChunkName: "attractor" */
          "./modules/attractor/attractor").then(activity => {
          initActivity(activityName, activity);
        });
      } else if (activityName === 'logisticmap') {
        import(
          /* webpackChunkName: "logisticmap" */
          "./modules/logisticmap/logisticmap").then(activity => {
          initActivity(activityName, activity);
        });
      } else if (activityName === 'lotka') {
        import(
          /* webpackChunkName: "lotka" */
          "./modules/lotka/lotka").then(activity => {
          initActivity(activityName, activity);
        });
      } else if (activityName === 'lsystem') {
        import(
          /* webpackChunkName: "lsystem" */
          "./modules/lsystem/lsystem").then(activity => {
          initActivity(activityName, activity);
        });
      }
    } else {
      initActivity(activityName);
    }
  };
})();


/**
 * Set current activity based on window.location.hash.
 * @param {boolean} force - reinitialize activity even if it's already current activiy.
 */
const updateActivity = (force = false) => {
  const activity = window.location.hash || '#home';
  changeActivity(activity.substr(1), force);  
};


/**
 * Init stuff. Mostly adds event listeners to UI components.
 */
const init = () => {
  // activate navbar links
  for (const p of Object.keys(activities)) {
    $(`a[href="#${ p }"]`).click((e) => changeActivity(p));
  }
  // search input
  $('#search-input').on('input', (e) => {
    const searchWords = e.target.value.split(' ');
    const searchExp = searchWords.map(w => `(${ w })`).join('.*');
    const searchTerm = new RegExp(searchExp, 'i');
    const items = $('#sidebar-filter-items a');
    items.show();
    items
      .filter((index, item) => !searchTerm.test(item.dataset.search))
      .hide();
  });
  // set active page based on current hash
  updateActivity();
};


// Webpack HMR
if (module.hot) {
  const cb = (updated) => {
    console.log(`Accepting the updated ${ updated } module!`);
    activities.attractor = attractor;
    activities.logisticmap = logisticmap;
    activities.lotka = lotka;
    activities.lsystem = lsystem;
    activities.home = home;
    updateActivity(true);
  };
  // HMR is not working with array of dependencies for some reason
  // so this don't work:
  // const dependencies = Object.keys(activities).map(p => `./modules/${ p }/${ p }`);
  // console.log(dependencies);
  // module.hot.accept(dependencies, cb);
  // but this does:
  module.hot.accept('./modules/attractor/attractor', cb);
  module.hot.accept('./modules/logisticmap/logisticmap', cb);
  module.hot.accept('./modules/lotka/lotka', cb);
  module.hot.accept('./modules/lsystem/lsystem', cb);
  module.hot.accept('./modules/home/home', cb);
}

init();
