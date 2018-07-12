# Cycle ReactDOM

> Cycle.js driver that uses React DOM to render the view

- Provides a driver factory `makeDOMDriver`
- Contains hyperscript helper functions, like in Cycle DOM

## Example

```js
import xs from 'xstream';
import {run} from '@cycle/run';
import {makeDOMDriver, div, h1, button} from '@cycle/react-dom';

function main(sources) {
  const inc$ = sources.react.select('inc').events('click');

  const count$ = inc$.fold(count => count + 1, 0);

  const vdom$ = count$.map(i =>
    div([
      h1(`Counter: ${i}`),
      button('inc', 'Increment'),
    ]),
  );

  return {
    react: vdom$,
  };
}

run(main, {
  react: makeDOMDriver(document.getElementById('app')),
});
```

## API

### `makeDOMDriver(container)`

Returns a driver that uses ReactDOM to render your Cycle.js app into the given `container` element.

### Hyperscript helpers

Import hyperscript helpers such as `div`, `span`, `p`, `button`, `input`, etc to create React elements to represent the respective HTML elements: `<div>`, `<span>`, `<p>`, `<button>`, `<input>`, etc.

The basic usage is `div(props, children)`, but some variations and shortcuts are allowed:

- `div()` becomes `<div></div>`
- `div('#foo')` becomes `<div id="foo"></div>`
- `div('.red')` becomes `<div class="red"></div>`
- `div('.red.circle')` becomes `<div class="red circle"></div>`
- `div('#foo.red.circle')` becomes `<div id="foo" class="red circle"></div>`
- `div(propsObject)` becomes `<div {...props}></div>`
- `div('text content')` becomes `<div>text content</div>`
- `div([child1, child2])`
- `div(propsObject, 'text content')`
- `div(propsObject, [child1, child2])`
- `div('#foo.bar', propsObject, [child1, child2])`
- etc

There are also shortcuts for (MVI) intent selectors:

- `div('inc#foo.bar')` becomes `<div selector="inc" id="foo" class="bar"></div>`
- `div('inc', propsObject)` becomes `<div selector="inc" {...props}></div>`
- `div('inc', 'text content')`
- `div('inc', [child1, child2])`
- `div('inc', propsObject, [child1, child2])`
- etc

## License

MIT, Andre 'Staltz' Medeiros 2018

