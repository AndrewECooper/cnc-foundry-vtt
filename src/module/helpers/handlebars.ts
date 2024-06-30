/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function () {
  let outStr = '';
  for (let arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr.trim();
});

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('localizeLowerCase', function (str) {
  return game instanceof Game ? game.i18n.localize(str).toLowerCase() : str.toLowerCase();
});

Handlebars.registerHelper('toUpperCase', function (str) {
  return str.toUpperCase();
});

Handlebars.registerHelper('localizeUpperCase', function (str) {
  return game instanceof Game ? game.i18n.localize(str).toUpperCase() : str.toUpperCase();
});

Handlebars.registerHelper('toCapitalCase', function (str) {
  return str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
});

Handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});