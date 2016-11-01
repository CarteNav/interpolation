
var analyze = require('../../lib/analyze');

module.exports.analyze = {};

module.exports.analyze.street = function(test) {
  test('street: synonym expansions', function(t) {
    var perms = analyze.street('grolmanstraße');
    t.deepEqual(perms, ['grolmanstrasse', 'grolman strasse']);
    t.end();
  });
  test('street: remove ordinals', function(t) {
    var perms = analyze.street('West 26th st');
    t.deepEqual(perms, ['west 26 saint', 'west 26 street']);
    t.end();
  });
  test('street: always returns array', function(t) {
    var perms = analyze.street('');
    t.deepEqual(perms, ['']);
    t.end();
  });
};

module.exports.analyze.housenumber = function(test) {
  test('housenumber: invalid', function(t) {
    var float = analyze.housenumber('no numbers');
    t.true(isNaN(float), 'return NaN');
    t.end();
  });
  test('housenumber: invalid (range)', function(t) {
    var float = analyze.housenumber('1-1');
    t.true(isNaN(float), 'return NaN');
    t.end();
  });
  test('housenumber: invalid (apartment synonyms)', function(t) {
    var float = analyze.housenumber('1 flat b');
    t.true(isNaN(float), 'return NaN');
    t.end();
  });
  test('housenumber: invalid (punctuation)', function(t) {
    var float = analyze.housenumber('1/1');
    t.true(isNaN(float), 'return NaN');
    t.end();
  });
  test('housenumber: empty', function(t) {
    var float = analyze.housenumber('');
    t.true(isNaN(float), 'return NaN');
    t.end();
  });
  test('housenumber: numeric', function(t) {
    var float = analyze.housenumber('22');
    t.equal(float, 22);
    t.end();
  });
  test('housenumber: apartment', function(t) {
    var float = analyze.housenumber('22a');
    t.equal(float, 22.03);
    var float2 = analyze.housenumber('22z');
    t.equal(float2, 22.78);
    t.end();
  });
  test('housenumber: apartment with space', function(t) {
    var float = analyze.housenumber('22 B');
    t.equal(float, 22.06);
    t.end();
  });
  test('housenumber: apartment with a character symbolizing null', function(t) {
    var float = analyze.housenumber('9/-');
    t.equal(float, 9);
    t.end();
  });
  test('housenumber: apartment with forward slash between number and letter', function(t) {
    var float = analyze.housenumber('1/A');
    t.equal(float, 1.03);
    var float2 = analyze.housenumber('200/F');
    t.equal(float2, 200.18);
    t.end();
  });
  test('housenumber: apartment with forward slash between number and another number', function(t) {
    var float = analyze.housenumber('200/22');
    t.true(isNaN(float), 'return NaN');
    var float2 = analyze.housenumber('1/1');
    t.true(isNaN(float2), 'return NaN');
    t.end();
  });
  test('housenumber: apartment with minus between number and letter', function(t) {
    var float = analyze.housenumber('28-H');
    t.equal(float, 28.24);
    var float2 = analyze.housenumber('200-A');
    t.equal(float2, 200.03);
    t.end();
  });
  test('housenumber: apartment with minus between number and another number', function(t) {
    var float = analyze.housenumber('200-22');
    t.true(isNaN(float), 'return NaN');
    var float2 = analyze.housenumber('1-1');
    t.true(isNaN(float2), 'return NaN');
    t.end();
  });
};
module.exports.analyze.housenumberFloatToString = function(test) {
  test('housenumberFloatToString: invalid', function(t) {
    var str = analyze.housenumberFloatToString(/not a string/);
    t.equal(str, '', 'return empty string');
    t.end();
  });
  test('housenumberFloatToString: empty', function(t) {
    var str = analyze.housenumberFloatToString('');
    t.equal(str, '', 'return empty string');
    t.end();
  });
  test('housenumberFloatToString: numeric', function(t) {
    var str = analyze.housenumberFloatToString(22);
    t.equal(str, '22');
    t.end();
  });
  test('housenumberFloatToString: apartment A', function(t) {
    var str = analyze.housenumberFloatToString(22.03);
    t.equal(str, '22a');
    t.end();
  });
  test('housenumberFloatToString: apartment B', function(t) {
    var str = analyze.housenumberFloatToString(22.06);
    t.equal(str, '22b');
    t.end();
  });
  test('housenumberFloatToString: apartment C', function(t) {
    var str = analyze.housenumberFloatToString(22.09);
    t.equal(str, '22c');
    t.end();
  });
  test('housenumberFloatToString: apartment D', function(t) {
    var str = analyze.housenumberFloatToString(22.12);
    t.equal(str, '22d');
    t.end();
  });
  test('housenumberFloatToString: apartment W', function(t) {
    var str = analyze.housenumberFloatToString(22.69);
    t.equal(str, '22w');
    t.end();
  });
  test('housenumberFloatToString: apartment X', function(t) {
    var str = analyze.housenumberFloatToString(22.72);
    t.equal(str, '22x');
    t.end();
  });
  test('housenumberFloatToString: apartment Y', function(t) {
    var str = analyze.housenumberFloatToString(22.75);
    t.equal(str, '22y');
    t.end();
  });
  test('housenumberFloatToString: apartment Z', function(t) {
    var str = analyze.housenumberFloatToString(22.78);
    t.equal(str, '22z');
    t.end();
  });
};

module.exports.all = function (tape) {

  function test(name, testFunction) {
    return tape('analyze: ' + name, testFunction);
  }

  for( var testCase in module.exports.analyze ){
    module.exports.analyze[testCase](test);
  }
};
