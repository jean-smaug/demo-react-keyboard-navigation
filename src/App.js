import React from "react";

const Context = React.createContext(null)

function withContext(Component) {
  return function WrappedContext(props) {
    return (
    <Context.Consumer>
      {(context) => <Component {...props} {...context} />}
    </Context.Consumer>
    )
  }
}

const Child = withContext((props) => {
  return (
    <span>{props.counter}</span>
  )
})

const Button = React.memo(() => {
  console.log('button')
  return <button>Click</button>
})

function handleClick () {
  console.log('aze')
}

function App() {
  console.log('App')
  const [counter, setCounter] = React.useState(10);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter(counter => counter - 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <Context.Provider value={{ counter, text }}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <Child />
      <Button onClick={handleClick} />
    </Context.Provider>
  );
}

export default App;
