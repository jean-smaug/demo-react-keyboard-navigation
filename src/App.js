import React from "react";

const Context = React.createContext(null);

const allowdedKeys = ["ArrowUp", "ArrowDown"];

function NavigationProvider(props) {
  const [focusedItem, setFocusedItem] = React.useState(props.defaultFocus);
  const [keys, setKeys] = React.useState([]);

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (!allowdedKeys.includes(e.key)) return;
      const eventName = e.key.substring(5, e.key.length).toLowerCase();

      const key = keys.find(key => key.name === focusedItem);

      const target = key[eventName];
      if (!!target) {
        setFocusedItem(target);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, focusedItem]); // eslint-disable-line

  function registerKey(newKey) {
    setKeys(keys => [...keys, newKey]);
  }

  return (
    <Context.Provider
      value={{ focus: focusedItem, setFocusedItem, registerKey }}
    >
      {props.children}
    </Context.Provider>
  );
}

function Child(props) {
  const ctx = React.useContext(Context);
  const [focus, setFocus] = React.useState(false);

  const { name, up, down } = props;
  React.useEffect(() => {
    ctx.registerKey({ name, up, down });
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (ctx.focus === props.name) {
      setFocus(focus => !focus);
    }
    if (focus && ctx.focus !== props.name) {
      setFocus(focus => !focus);
    }
  }, [ctx.focus]); // eslint-disable-line

  return React.useMemo(() => {
    console.log("useMemo", props.name);
    return (
      <div style={{ color: focus ? "blue" : "red" }}>{props.children}</div>
    );
  }, [focus]); // eslint-disable-line
}

function App() {
  return (
    <div style={{ margin: "20px" }}>
      <NavigationProvider defaultFocus="one">
        <Child name="one" down="two">
          Element 1
        </Child>

        <Child name="two" up="one" down="third">
          Element 2
        </Child>

        <Child name="third" up="two" down="fourth">
          Element 3
        </Child>

        <Child name="fourth" up="third">
          Element 4
        </Child>
      </NavigationProvider>
    </div>
  );
}

export default App;
