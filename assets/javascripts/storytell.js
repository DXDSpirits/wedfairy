require([
    'storytell/app',
    'storytell/router',
    'storytell/eventview',
    'storytell/lottery'
], function(App) {
    window.App = App;
    App.tell();
});
