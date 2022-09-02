import "./assets/styles/custom.css";
import "./assets/styles/customDev.css";
import "react-image-crop/dist/ReactCrop.css";
import userStore from "./store/userStore";

import Layout from "./layout/Layout";
import { useEffect, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Index from "./pages";
import Production from "./pages/production";
import NFT from "./pages/nft";
import Market from "./pages/market";
import FullLoader from "./util/components/fullLoader";

function App() {
  const { loading, setWallet } = userStore((state) => state);

  useEffect(() => {
    setWallet();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <FullLoader/>
      ) : (
        <Fragment>
          <Router>
            <Layout>
              <Switch>
                {/* <Redirect from="/" to="/production-list" /> */}
                <Route path="/production-list" component={Index} exact />
                <Route path="/production" component={Production} exact />
                <Route path="/production/:id" component={Production} exact />
                <Route path="/nft" component={NFT} exact />
                <Route path="/market-place" component={Market} exact />
                <Redirect from="/" to="/production-list" />
                <Route path="*" render={() => <h1>404</h1>} />
              </Switch>
            </Layout>
          </Router>
        </Fragment>
      )}
    </Fragment>
  );
}

export default App;
