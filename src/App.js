import React from "react";

const Context = React.createContext(null)

const Child = React.memo(() => {
  console.log('Child')
  const { text, value } = React.useContext(Context)

  return React.useMemo(() => {
    return (
      <span>{text}</span>
    )
  }, [value])
}, () => true)

function App() {
  const [text, setText] = React.useState("");
  const [value, setValue] = React.useState(0);

  function setRandomValue() {
    setValue(Math.random())
  }

  return (
    <Context.Provider value={{ text, value }}>
      <button onClick={setRandomValue}>Validate</button>
      <input value={text} onChange={e => setText(e.target.value)} />
      <Child />
    </Context.Provider>
  );
}

export default App;
