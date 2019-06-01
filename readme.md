# Cycle ReactDOM

> Cycle.js driver that uses React DOM to render the view

- Provides a driver factory `makeDOMDriver`
- Contains hyperscript helper functions, like in Cycle DOM

```
npm install @cycle/react-dom
```

## Example

```js
import xs from 'xstream';
import {run} from '@cycle/run';
import {makeDOMDriver, div, h1, button} from '@cycle/react-dom';

function main(sources) {
  const inc = Symbol();
  const inc$ = sources.react.select(inc).events('click');

  const count$ = inc$.fold(count => count + 1, 0);

  const vdom$ = count$.map(i =>
    div([
      h1(`Counter: ${i}`),
      button(inc, 'Increment'),
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

- `div()` becomes `h('div')`
- `div('#foo')` becomes `h('div', {id: 'foo'})`
- `div('.red')` becomes `h('div', {className: 'red'})`
- `div('.red.circle')` becomes `h('div', {className: 'red circle'})`
- `div('#foo.red')` becomes `h('div', {id: 'foo', className: 'red'})`
- `div(propsObject)` becomes `h('div', propsObject)`
- `div('text content')` becomes `h('div', 'text content')`
- `div([child1, child2])` becomes `h('div', [child1, child2])`
- `div(props, 'text content')` becomes `h('div', props, 'text content')`
- `div(props, [child1, child2])` becomes `h('div', props, [child1, child2])`
- `div('#foo.bar', props, [child1, child2])`
- etc

There are also shortcuts for (MVI) intent selectors:

- `div(someSymbol)` becomes `h('div', {sel: someSymbol})`
- `div('inc#foo.bar')` becomes `h('div', {sel: 'inc', id: 'foo', className: 'bar'})`
- `div('inc', props)` becomes `h('div', {sel: 'inc', ...props})`
- `div('inc', 'text content')` becomes `h('div', {sel: 'inc'}, 'text content')`
- `div('inc', [child1])` becomes `h('div', {sel: 'inc'}, [child1])`
- `div('inc', props, [child1])` becomes `h('div', {sel: 'inc'}, [child1])`
- etc

## JSX

### Babel

Add the following to your webpack config:

```js
module: {
  rules: [
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        plugins: [
          ['transform-react-jsx', { pragma: jsxFactory.createElement' }],
        ]
      }
    }
  ]
},
```

If you used `create-cycle-app` you may have to eject to modify the config.

### Automatically providing jsxFactory

You can avoid having to import `jsxFactory` in every jsx file by allowing webpack to provide it:

```js
plugins: [
  new webpack.ProvidePlugin({
    jsxFactory: ['react-dom', 'jsxFactory']
  })
],
```

### Typescript

Add the following to your `tsconfig.json`:

```js
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "jsxFactory.createElement"
  }
}
```

If webpack is providing `jsxFactory` you will need to add typings to `custom-typings.d.ts`:

```js
declare var jsxFactory: any;
```


## Usage

```js
import { jsxFactory } from '@cycle/react-dom';

function view(state$: Stream<State>): Stream<ReactElement> {
    return state$.map(({ count }) => (
        <div>
            <h2>Counter: {count}</h2>
            <button sel="add">Add</button>
            <button sel="subtract">Subtract</button>
        </div>
    ));
}
```

## Notes

Please ensure you are depending on compatible versions of `@cycle/react` and `@cycle/react-dom`. They should both be at least version `2.1.x`.

```
yarn list @cycle/react
```

should return a single result.


## License

MIT, Andre 'Staltz' Medeiros 2018

