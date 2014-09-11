require([
    'app',
    'router',
    'eventview',
    'lottery'
], function(App) {
    window.App = App;
    App.tell();
});
