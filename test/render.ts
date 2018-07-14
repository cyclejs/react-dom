import xs from 'xstream';
import {h, ReactSource} from '@cycle/react';
import {makeDOMDriver, h1, h2, h3, h4} from '../src/index';
import {run} from '@cycle/run';
const assert = require('assert');

function createRenderTarget(id: string | null = null) {
  const element = document.createElement('div');
  element.className = 'cycletest';
  if (id) {
    element.id = id;
  }
  document.body.appendChild(element);
  return element;
}

describe('rendering', function() {
  it('makeDOMDriver renders hello world Cycle.js app on the DOM', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(
          h('section', [h('div', {}, [h('h1', {}, 'Hello world')])]),
        ),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const h1 = target.querySelector('h1');
      if (!h1) {
        return done('No H1 element found');
      }
      assert.strictEqual(h1.innerHTML, 'Hello world');
      done();
    }, 100);
  });

  it('makeDOMDriver renders counter Cycle.js app on the DOM', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        h('div', {}, [
          h('h1', {}, '' + i),
          h('button', {sel: 'inc'}, 'increment'),
        ]),
      );
      return {react: vdom$};
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const button = target.querySelector('button') as HTMLElement;
      const h1 = target.querySelector('h1') as HTMLElement;
      assert.strictEqual(!!button, true);
      assert.strictEqual(!!h1, true);
      assert.strictEqual(h1.innerHTML, '0');
      button.click();
      setTimeout(() => {
        assert.strictEqual(h1.innerHTML, '1');
        done();
      }, 100);
    }, 100);
  });

  it('hyperscript helper without class/id works', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(h1('heading 1')),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const h1 = target.querySelector('h1') as HTMLElement;
      assert.strictEqual(!!h1, true);
      assert.strictEqual(h1.innerHTML, 'heading 1');
      done();
    }, 100);
  });
});
