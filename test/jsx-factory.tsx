import { createElement, Attributes, ReactElement, ReactType } from 'react';
const assert = require('assert');
import {ReactSource} from '@cycle/react';
import {makeDOMDriver, jsxFactory} from '../src/index';
import {run} from '@cycle/run';
import xs  from 'xstream';

function createRenderTarget(id: string | null = null) {
  const element = document.createElement('div');
  element.className = 'cycletest';
  if (id) {
    element.id = id;
  }
  document.body.appendChild(element);
  return element;
}

describe('jsx-factory', function() {
  it('w/ nothing', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(<h1></h1>),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const h1 = target.querySelector('h1') as HTMLElement;
      assert.strictEqual(!!h1, true);
      assert.strictEqual(h1.tagName, 'H1');
      done();
    }, 100);
  });

  it('w/ text child', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(<h1>heading 1</h1>),
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

  it('w/ children array', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(
            <section>
              <h1>heading 1</h1>
              <h2>heading 2</h2>
              <h3>heading 3</h3>
            </section>
        ),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.children.length, 3);
      done();
    }, 100);
  });

  it('w/ props', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(<section data-foo="bar"/>),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.dataset.foo, 'bar');
      done();
    }, 100);
  });

  it('w/ props and children', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(
          <section data-foo="bar">
            <h1>heading 1</h1>
            <h2>heading 2</h2>
            <h3>heading 3</h3>
          </section>
        ),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.dataset.foo, 'bar');
      assert.strictEqual(section.children.length, 3);
      done();
    }, 100);
  });

  it('w/ className', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(<section className="foo"/>),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.className, 'foo');
      done();
    }, 100);
  });

  it('w/ symbol selector', done => {
    function main(sources: {react: ReactSource}) {

      const inc = Symbol();
      const inc$ = sources.react.select(inc).events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) => (
        <div>
          <h1>{'' + i}</h1>
          <button sel={inc}/>
        </div>
      ));

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

  it('renders functional component', done => {
    const Test = () => (<h1>Functional</h1>);

    function main() {
      const vdom$ = xs.of(<Test/>);
      return {react: vdom$};
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const h1 = target.querySelector('h1') as HTMLElement;
      assert.strictEqual(!!h1, true);
      done();
    }, 100);
  });

  it('renders class component', done => {
    class Test extends React.Component {
      render() {
        return (<h1>Class</h1>);
      }
    }

    function main() {
      const vdom$ = xs.of(<Test/>);
      return {react: vdom$};
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const h1 = target.querySelector('h1') as HTMLElement;
      assert.strictEqual(!!h1, true);
      done();
    }, 100);
  });

});
