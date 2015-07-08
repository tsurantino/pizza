var hbs = require('hbs');

module.exports = function() {
  var blocks = {};

  hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
      block = blocks[name] = [];
    }

    block.push(context.fn(this));
  });

  hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
  });

  hbs.registerHelper('select', function(value, options) {
    return options.fn(this)
      .split('\n')
      .map(function(v) {
        var t = 'value="' + value + '"'
        return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
      })
      .join('\n');
  });
};