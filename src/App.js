import "./App.css";
import Custom from "./components/Custom";
import MaterailUi from './components/Materail'


import { Component, Fragment } from "react";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  render() {
    const { selected } = this.state;
    return (
      <div class="container mt-4">
        <div class="centered">
          {selected == 0 ? (
            <Fragment>
              <button type="button" class="btn btn-primary me-2">
                Custom Library
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary"
                onClick={() => this.setState({ selected: 1 })}
              >
                Material UI
              </button>
            </Fragment>
          ) : (
              <Fragment>
                <button type="button" class="btn btn-outline-primary me-2"
                  onClick={() => this.setState({ selected: 0 })}
                >
                  Custom Library
              </button>
                <button type="button" class="btn btn-secondary">
                  Materail Ui
              </button>
              </Fragment>
            )}
        </div>
        <div class="mt-4">
          {
            selected == 0 ?
              <Custom></Custom>
              :
              <MaterailUi></MaterailUi>
          }
        </div>
      </div>
    );
  }
}

export default App;
