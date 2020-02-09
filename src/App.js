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
    return (
      <div style={{ color: focus ? "blue" : "red" }}>{props.children}</div>
    );
  }, [focus]); // eslint-disable-line
}

function App() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(json => {
        setUsers(json);
      });
  }, []);

  if (users.length === 0) return "Loading...";

  return (
    <div style={{ margin: "20px" }}>
      <NavigationProvider defaultFocus={`user-${users[0].id}`}>
        {users.map((user, index) => (
          <Child
            key={`user-${user.id}`}
            name={`user-${user.id}`}
            down={users[index + 1] ? `user-${users[index + 1].id}` : null}
            up={users[index - 1] ? `user-${users[index - 1].id}` : null}
          >
            {user.name}
          </Child>
        ))}
      </NavigationProvider>
    </div>
  );
}

export default App;
