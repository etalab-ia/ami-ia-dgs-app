import React, { useState, useEffect } from 'react';
import PageLayout from '@layout/PageLayout.jsx';
import { Input, Row, Col, Menu } from 'antd';
import { getDistances } from '../../requests';
import HTMLReactParser from 'html-react-parser';
import parse from 'html-react-parser';
import WordCloudStandalone from './components/WordCloudStandalone/index.jsx';
import Documents from './components/Documents/index.jsx';
import Clusters from './components/Clusters/index.jsx';
import Topic from './components/Topic/index.jsx';
import DCO from './components/DCO/index.jsx'
import ClustersModel from './components/ClustersModel/index.jsx';
import TopicModel from './components/TopicModel/index.jsx'

const Visualisation = props => {
  const [menu, setMenu] = useState(props.location?.state?.menu)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageLayout title="Visualisation">
      <Menu onClick={e => setMenu(e.key)} selectedKeys={menu} mode="horizontal">
        <Menu.Item key="6">
          Analyse par document
        </Menu.Item>
        <Menu.Item key="2">
          Topic
        </Menu.Item>
        <Menu.Item key="7">
          Clusters
        </Menu.Item>
        <Menu.Item key="8">
          DCOs
        </Menu.Item>
        <Menu.Item key="3">
          Topics Visualisation Globale
        </Menu.Item>
        <Menu.Item key="4">
          Clusters Visualisation Globale
        </Menu.Item>
      </Menu>
      <div>
        {((menu) => {
          switch (menu) {
            case '2':
              return (<Topic />)
            case '3':
              return (<TopicModel />)
            case '4':
              return (<ClustersModel />)
            case '6':
              return (<Documents />)
            case '7':
              return (<Clusters />)
            case '8':
              return (<DCO />)
          }
        })(menu)}
      </div>
    </PageLayout>
  );
};

export default Visualisation;
