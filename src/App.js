import React from "react";
import memoize from "memoize-one";
import { FixedSizeList as List, areEqual, FixedSizeGrid as Grid } from "react-window";

const Row = React.memo((props) => {
  const { index, style, key } = props

  return (
    <div style={{ ...style, left: props.columnIndex === 1 ? style.left + 100 : style.left }}>
      Row {index}
      <img alt="" src={`https://via.placeholder.com/150`} />
    </div>
  );
},areEqual);

const createItemData = memoize((items) => (items));

const Example = React.memo(() => {
  console.log("Example");

  const itemData = createItemData(Array(100)
      .fill()
      .map((_, i) => i)
  );

  return (
    <Grid
      columnCount={2}
      columnWidth={150}
      height={500}
      rowCount={itemData.length}
      rowHeight={200}
      width={450}
      itemData={itemData}
    >
      {Row}
    </Grid>
  );
});

function App() {
  const [value, setValue] = React.useState("");

  return (
    <>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <Example />
    </>
  );
}

export default App;

// const Row = ({ index, style }) => (
//   <div
//     className={index % 2 ? "ListItemOdd" : "ListItemEven"}
//     style={{ ...style, height: 300, top: style.top + 300 }}
//   >
//     Row {index}
//     <img
//       style={{ position: "absolute" }}
//       src={`https://picsum.photos/200/200?nocache=${index}`}
//     />
//   </div>
// );

// const Example = React.memo(() => {
//   console.log("Example");
//   return (
//     <List
//       className="List"
//       height={1000}
//       itemCount={100}
//       itemSize={35}
//       width={1000}
//     >
//       {Row}
//     </List>
//   );
// });

// const Test = React.memo(() => {
//   return performance.now()
// }, () => true)
