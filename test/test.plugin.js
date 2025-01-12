import postcss from 'postcss';
import test from 'ava';
import plugin from '../src';

const processing = (input, options) => {
  return postcss([plugin(options)]).process(input).css;
};

test('it should return body color for background', t => {
  const expected = 'body{background: #fff;}';
  const value = 'body{background: map-get((body: #fff,main-red: #c53831,link-blue: #0592fb) !default, body);}';
  t.is(processing(value), expected);
});

test('it should return body color and min-width width from decl', t => {
  const expected = 'body{background: #fff;min-width: 1280px;}';
  const value = 'body{background: map-get((body: #fff,main-red: #c53831,link-blue: #0592fb) !default, body);min-width: map-get((xxs: 0,xs: 576px,sm: 768px,md: 992px,lg: 1280px,xl: 1360px,xxl: 1600px) !default, lg);}';
  t.is(processing(value), expected);
});

test('it should return width for at rule @media', t => {
  const expected = '@media (min-width: 1280px) {body {overflow-x: hidden}}';
  const value = '@media (min-width: map-get((xxs: 0,xs: 576px,sm: 768px,md: 992px,lg: 1280px,xl: 1360px,xxl: 1600px) !default, lg)) {body {overflow-x: hidden}}';
  t.is(processing(value), expected);
});

test('it should return width for decl', t => {
  const expected = '.cnr-main {min-width: (1280px - 17);}';
  const value = '.cnr-main {min-width: (map-get((xxs: 0,xs: 576px,sm: 768px,md: 992px,lg: 1280px,xl: 1360px,xxl: 1600px) !default, lg) - 17);}';
  t.is(processing(value), expected);
});

test('it should keep proper string format for element before invocation, borderColor', t => {
  const expected = '.foo {border: 1px solid #FFF;}';
  const value = '.foo {border: 1px solid map-get((borderColor: #FFF) !default, borderColor);}';
  t.is(processing(value), expected);
});

test('it should keep proper string format for element before and after invocation, borderStyle', t => {
  const expected = '.foo {border: 1px solid #FFF;}';
  const value = '.foo {border: 1px map-get((borderStyle: solid) !default, borderStyle) #FFF;}';
  t.is(processing(value), expected);
});

test('it should resolve multiple map-get on the same property value', t => {
  const expected = '.foo {border: 1px solid #FFF;}';
  const value = '.foo {border: 1px map-get((borderStyle: solid), borderStyle) map-get((borderColor: #FFF), borderColor);}';
  t.is(processing(value), expected);
});

test('it should resolve nested invocation', t => {
  const expected = '.foo {color: green}';
  const value = '.foo {color: map-get(map-get((corporate: (textColor: green), ea: (textColor: black)), corporate), textColor)}';
  t.is(processing(value), expected);
});

test('it should throw an error when key is not defined', t => {
  const requestedKey = 'notfound';
  const map = '(main: #FF0000)';
  const value = `.foo { color: map-get(${map}, ${requestedKey}) }`;

  const testError = t.throws(() => {
    processing(value);
  }, null);

  t.is(testError.message, `postcss – map-get – unable to find “${requestedKey}“ key inside map “${map}“`);
});

test('it should remove line breaks and space from map key only', t => {
  const expected = '.foo {border: 1px solid black}';
  const value = '.foo {border: map-get((\n  border: 1px solid black), border)}';
  t.is(processing(value), expected);
});