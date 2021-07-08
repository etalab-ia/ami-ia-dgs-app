import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { MainLayout } from '@layout/MainLayout.jsx'
import { CustomRoute } from './route.jsx'
import Classification from '@pages/classification/index.jsx'
import Visualisation from '@pages/visualisation/index.jsx'
import About from '@pages/about/About.jsx'
import Auth from '@pages/auth/index.js'
import { GlobalContext } from '../GlobalContext.js'

const routes = [
  {
    path: '/classification',
    component: Classification,
  },
  {
    path: '/visualisation',
    component: Visualisation,
  },
  {
    path: '/about',
    component: About,
  }
]

const authRoute = {
  path: '/auth',
  component: Auth
}

const AppRouter = () => {
  const classification = [useState([]), useState(0), useState([]), useState([])]
  const documents = [useState()]
  const topic = [useState(), useState(), useState([]), useState()]
  const clusters = { state: [useState(), useState([]), useState(), useState([])], id: useState() }
  const dco = [useState()]
  const topicModel = [useState()]
  const clustersModel = [useState([]), useState([]), useState(), useState({}),
    useState(-1), useState([]), useState([]), useState([]), useState([])]
  const auth = [useState(), useState()]

  const context = {
    classification: classification,
    documents: documents,
    topic: topic,
    clusters: clusters,
    dco: dco,
    topicModel: topicModel,
    clustersModel: clustersModel,
    auth: auth
  }

  return (
    <Router basename="/dgs">
      <GlobalContext.Provider value={context}>
        <MainLayout>
          {
            routes.map((route, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <CustomRoute key={i} {...route} />
            ))
          }
          <Redirect from="/" to="/auth" />
          <Route path={authRoute.path}>
            <Auth />
          </Route>
        </MainLayout>
      </GlobalContext.Provider>
    </Router>
  )
}

export default AppRouter
