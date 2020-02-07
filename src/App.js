import React from "react";

const Context = React.createContext(null)

const allowdedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

function NavigationProvider(props) {
  const [focusedItem, setFocusedItem] = React.useState("")
  const [keys, setKeys] = React.useState([])

  function registerKey(newKey) {
    setKeys([...keys, newKey])
  }

  React.useEffect(() => {
    function handleKeyDown(e) {
      if(!allowdedKeys.includes(e.key)) return

      console.log(e.key)
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return React.useMemo(() => (
    <Context.Provider value={{ focus: focusedItem, setFocusedItem, registerKey }}>
      {props.children}
    </Context.Provider>
  ), [])
}

function withNavigation(Component) {
  return function (props) {
    return (
      <Context.Consumer>
        {
          context => {
            function capitalize(str) {
              return str[0].toUpperCase().concat(str.slice(1, str.length))
            }

            const name = props.name
            const handlers = Object.keys(props).filter(prop => allowdedKeys.includes(`Arrow${capitalize(prop)}`))
            context.registerKey({ name })
            // console.log(context)
            // console.log(handlers)
            // console.log(name)

            return <Component {...props} {...context} />
          }
        }
      </Context.Consumer>
    )
  }
}

function Child(props) {
  return <div>{props.children}</div>
}

const Element1 = withNavigation(Child)
const Element2 = withNavigation(Child)

function App() {
  return (
    <NavigationProvider>
      <Element1 name="one" down="two">
        Element 1
      </Element1>
      
      <Element2 name="two" up="one">
        Element 2
      </Element2>
    </NavigationProvider>
  )
}

export default App;
