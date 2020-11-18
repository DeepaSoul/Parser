import React, { Fragment } from 'react';
import './App.scss';

import Header from './components/Header';
import DataDisaply from './components/Datadisplay';

function App() {
  return (
    <Fragment>
      <Header title="Data Visualisation" />
      <DataDisaply/>
    </Fragment>
  );
}

export default App;
