import React from "react";

import "./App.css";

const NavigationContext = React.createContext(null);

const EVENTS_MAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowRight: "right",
  ArrowLeft: "left",
  Enter: "enter",
};

function NavigationProvider(props) {
  const [focusedItem, setFocusedItem] = React.useState(props.defaultFocus);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (!Object.keys(EVENTS_MAP).includes(e.code)) return;

      const eventName = EVENTS_MAP[e.code];

      const key = items.find((key) => key.name === focusedItem);

      const target = key[eventName];

      if (!!target) {
        if (typeof target === "function") {
          return target();
        }

        setFocusedItem(target);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [items, focusedItem]); // eslint-disable-line

  function registerItem(newItem) {
    setItems((items) => [...items, newItem]);
  }

  function unregisterItem(itemToDelete) {
    setItems((items) =>
      items.filter((item) => itemToDelete.name !== item.name)
    );
  }

  return (
    <NavigationContext.Provider
      value={{ focus: focusedItem, registerItem, unregisterItem }}
    >
      {props.children}
    </NavigationContext.Provider>
  );
}

function useIsFocused(props) {
  const { focus, registerItem, unregisterItem } = React.useContext(
    NavigationContext
  );

  const { name } = props;
  const isFocused = focus === name;

  React.useEffect(() => {
    const eventKeys = Object.values(EVENTS_MAP).reduce((acc, value) => {
      return {
        ...acc,
        [value]: props[value],
      };
    }, {});

    const eventKeysWithName = { ...eventKeys, name };

    registerItem(eventKeysWithName);

    return () => {
      unregisterItem(eventKeysWithName);
    };
  }, []); // eslint-disable-line

  return isFocused;
}

function ListItem(props) {
  const isFocused = useIsFocused(props);

  return React.useMemo(() => {
    return (
      <li
        className="List__Item"
        style={{
          boxShadow: isFocused ? "#373737 0px 4px 9px -3px" : null,
        }}
      >
        {props.children}
      </li>
    );
  }, [isFocused]); // eslint-disable-line
}

function App() {
  const [choice, setChoice] = React.useState(null);
  // const [isVisible, setVisibleStatus] = React.useState(true);

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setVisibleStatus(false);
  //   }, 1000);
  // }, []);

  return (
    <>
      <ul className="List">
        <NavigationProvider defaultFocus="pizza">
          <ListItem name="pizza" right="pasta" enter={() => setChoice("pizza")}>
            Pizza
          </ListItem>

          <ListItem
            name="pasta"
            right="lasagna"
            left="pizza"
            enter={() => setChoice("pasta")}
          >
            Pasta
          </ListItem>

          <ListItem
            name="lasagna"
            left="pasta"
            enter={() => setChoice("lasagna")}
          >
            Lasagna
          </ListItem>
        </NavigationProvider>
      </ul>
      <span>You choosed : {choice ? choice : "nothing"}</span>
    </>
  );
}

export default App;
