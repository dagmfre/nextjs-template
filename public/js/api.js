// Stub API file for games - prevents 404 errors
// Games reference /js/api.js but don't require it for basic functionality
window.GameAPI = window.GameAPI || {
  ready: function() {},
  submitScore: function(score) { console.log('Score:', score); },
  getHighScore: function() { return 0; }
};
