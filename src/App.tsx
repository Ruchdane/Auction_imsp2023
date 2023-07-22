import "./index.css";
import Root from "../layout/root";
import ThemeDemo from "../demo/theme";
import FormDemo from "../demo/form";
import MakeBid from "../form/makebid";
import CreateItem from "../form/createitem";
import CreateAuction from "../form/createauction";
import Login from "../form/login";

function App() {

  return (
    <Root>
      {/* <ThemeDemo /> */}
      {/* <FormDemo /> */}
      <MakeBid/> 
      <CreateItem/>
      <CreateAuction/>
      <Login/>
    </Root>
  );
}

export default App;
