import "./index.css";
import Root from "../layout/root";
import ThemeDemo from "../demo/theme";
import FormDemo from "../demo/form";
import MakeBid from "../form/makebid";
import CreateItem from "../form/createitem";
import CreateAuction from "../form/createauction";

function App() {

  return (
    <Root>
      {/* <ThemeDemo /> */}
      {/* <FormDemo /> */}
      <MakeBid/> 
      <CreateItem/>
      <CreateAuction/>
    </Root>
  );
}

export default App;
