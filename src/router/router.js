/**
 * Created by So on 2018/6/7.
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Add from "../page/add/index";
import List from "../page/list/index";
import Chart from "../page/chart/index";

export class MainRouter extends React.Component {
  render() {
    return (
        <Switch>
          <Route exact path={'/add/:id?'} component={Add}/>
          <Route exact path={'/chart/:id?'} component={Chart}/>
          <Route exact path={'/'} component={Add}/>
          <Route exact path={'/list'} component={List}/>
        </Switch>
    );
  }
}