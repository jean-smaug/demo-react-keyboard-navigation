import React from "react";

const NavigationContext = React.createContext(null);

const allowdedKeys = ["ArrowUp", "ArrowDown"];

function NavigationProvider(props) {
  const [focusedItem, setFocusedItem] = React.useState(props.defaultFocus);
  const [keys, setKeys] = React.useState([]);

  React.useEffect(() => {
    function handleKeyDown(e) {
      const eventName = e.key.substring(5, e.key.length).toLowerCase();

      const key = keys.find((key) => key.name === focusedItem);

      if (e.key === "Enter") {
        key.enter();
      }

      if (!allowdedKeys.includes(e.key)) return;

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
    setKeys((keys) => [...keys, newKey]);
  }

  return (
    <NavigationContext.Provider
      value={{ focus: focusedItem, setFocusedItem, registerKey }}
    >
      {props.children}
    </NavigationContext.Provider>
  );
}

function Child(props) {
  const navigationContext = React.useContext(NavigationContext);
  const focus = navigationContext.focus === props.name;

  const { name, up, down, enter } = props;
  React.useEffect(() => {
    navigationContext.registerKey({ name, up, down, enter });
  }, []); // eslint-disable-line

  return React.useMemo(() => {
    return (
      <div style={{ outline: focus ? "1px solid blue" : null }}>
        {props.children}
      </div>
    );
  }, [focus]); // eslint-disable-line
}

function App() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
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
            enter={() => console.log(user.id)}
          >
            {user.name}
          </Child>
        ))}
      </NavigationProvider>
    </div>
  );
}

export default App;
