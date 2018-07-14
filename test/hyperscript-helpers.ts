import xs from 'xstream';
import {h, ReactSource} from '@cycle/react';
import {
  makeDOMDriver,
  section,
  h1,
  h2,
  h3,
  div,
  button,
  span,
} from '../src/index';
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

describe('hyperscript helpers', function() {
  it('w/ nothing', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(h1()),
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

  it('w/ children array', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(
          section([h1('heading 1'), h2('heading 2'), h3('heading 3')]),
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
        react: xs.of(section({['data-foo']: 'bar'})),
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
          section({['data-foo']: 'bar'}, [
            h1('heading 1'),
            h2('heading 2'),
            h3('heading 3'),
          ]),
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

  it('w/ className shortcut', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(section('.foo')),
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

  it('w/ multi-className shortcut', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(section('.foo.bar.baz')),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.classList.length, 3);
      assert.strictEqual(section.classList[0], 'foo');
      assert.strictEqual(section.classList[1], 'bar');
      assert.strictEqual(section.classList[2], 'baz');
      done();
    }, 100);
  });

  it('w/ id shortcut', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(section('#foo')),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.id, 'foo');
      done();
    }, 100);
  });

  it('w/ className + id shortcut', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(section('#foo.bar')),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.id, 'foo');
      assert.strictEqual(section.className, 'bar');
      done();
    }, 100);
  });

  it('w/ multi-className + id shortcut', done => {
    function main(sources: {react: ReactSource}) {
      return {
        react: xs.of(section('#foo.bar.baz')),
      };
    }

    const target = createRenderTarget();
    run(main, {
      react: makeDOMDriver(target),
    });

    setTimeout(() => {
      const section = target.querySelector('section') as HTMLElement;
      assert.strictEqual(!!section, true);
      assert.strictEqual(section.id, 'foo');
      assert.strictEqual(section.classList.length, 2);
      assert.strictEqual(section.classList[0], 'bar');
      assert.strictEqual(section.classList[1], 'baz');
      done();
    }, 100);
  });

  it('w/ symbol selector shortcut', done => {
    function main(sources: {react: ReactSource}) {
      const inc = Symbol();
      const inc$ = sources.react.select(inc).events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) => div([h1('' + i), button(inc)]));
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

  it('w/ symbol selector shortcut and empty props', done => {
    function main(sources: {react: ReactSource}) {
      const inc = Symbol();
      const inc$ = sources.react.select(inc).events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([h1('' + i), button(inc, {})]),
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

  it('w/ string sel shortcut and empty props', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([h1('' + i), button('inc', {})]),
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

  it('w/ string sel shortcut and child text', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([h1('' + i), button('inc', 'increment')]),
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

  it('w/ string sel shortcut and children array', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([h1('' + i), button('inc', [span('hello'), span('hi')])]),
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

  it('w/ string sel shortcut and props and children array', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([
          h1('' + i),
          button('inc', {['data-foo']: 'bar'}, [(span('hello'), span('hi'))]),
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
      assert.strictEqual(button.dataset.foo, 'bar');
      assert.strictEqual(!!h1, true);
      assert.strictEqual(h1.innerHTML, '0');
      button.click();
      setTimeout(() => {
        assert.strictEqual(h1.innerHTML, '1');
        done();
      }, 100);
    }, 100);
  });

  it('w/ string sel + class shortcut and props', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([h1('' + i), button('inc.red', {['data-foo']: 'bar'})]),
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
      assert.strictEqual(button.dataset.foo, 'bar');
      assert.strictEqual(button.className, 'red');
      assert.strictEqual(!!h1, true);
      assert.strictEqual(h1.innerHTML, '0');
      button.click();
      setTimeout(() => {
        assert.strictEqual(h1.innerHTML, '1');
        done();
      }, 100);
    }, 100);
  });

  it('w/ string sel + class shortcut and children array', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([h1('' + i), button('inc.red', [span('hello'), span('hi')])]),
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
      assert.strictEqual(button.className, 'red');
      assert.strictEqual(button.children.length, 2);
      assert.strictEqual(!!h1, true);
      assert.strictEqual(h1.innerHTML, '0');
      button.click();
      setTimeout(() => {
        assert.strictEqual(h1.innerHTML, '1');
        done();
      }, 100);
    }, 100);
  });

  it('w/ str sel + class shortcut and props and children array', done => {
    function main(sources: {react: ReactSource}) {
      const inc$ = sources.react.select('inc').events('click');
      const count$ = inc$.fold((acc: number, x: any) => acc + 1, 0);
      const vdom$ = count$.map((i: number) =>
        div([
          h1('' + i),
          button('inc.red', {['data-foo']: 'bar'}, [span('hello'), span('hi')]),
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
      assert.strictEqual(button.dataset.foo, 'bar');
      assert.strictEqual(button.className, 'red');
      assert.strictEqual(button.children.length, 2);
      assert.strictEqual(!!h1, true);
      assert.strictEqual(h1.innerHTML, '0');
      button.click();
      setTimeout(() => {
        assert.strictEqual(h1.innerHTML, '1');
        done();
      }, 100);
    }, 100);
  });
});
