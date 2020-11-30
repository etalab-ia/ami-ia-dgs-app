import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Button, notification, Upload, Row } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { HomeOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import './MainLayout.less'
import { GlobalContext } from '../GlobalContext.js'
import { getLastResults } from '../requests'
import { baseURL } from '../config.js'
import explorationIcon from './exploration.png'
import classificationIcon from './classification.png'

const rootRoutes = ['classification', 'visualisation', 'about']
const { Footer, Sider } = Layout
const route = baseURL + '/dgs-api/predict/all_models'

const MainLayout = props => {
  const context = useContext(GlobalContext).classification
  const auth = useContext(GlobalContext).auth
  const [data, setData] = context[0]
  const [index, setIndex] = context[1]
  const [names, setNames] = context[2]
  const [result_keys, setResultKeys] = context[3]
  const [collapsed, setCollapsed] = useState(false)
  const { children } = props
  const [menu, setMenu] = useState(0)

  const location = useLocation();

  let queue = []
  let n = []
  let nn = []
  let lkn = []

  useEffect(() => {
    setMenu(rootRoutes.indexOf(window.location.pathname.match(/([^\/]*)\/*$/)[1]).toString())
  }, [window.location.pathname])

  const headers = (username, password) => {
    return {
      Authorization: 'Basic ' + Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
    }
  }

  const handleChange = e => {
    if (e.file.status === 'uploading' && !n.includes(e.file.name)) {
      n.push(e.file.name)
      notification.info({ message: `${e.file.name} en cours d'envoi...` })
    }
    if (e.file?.status === 'done') {
      var keys = Object.keys(e.file.response).filter(k => k !== 'last_results_key')
    }
    if (e.file?.status === 'done' && e.file.response[keys] !== undefined) {
      n = n.filter(x => x !== e.file.name)
      nn.push(e.file.name)
      lkn.push(e.file.response['last_results_key'])
      queue.push(e.file.response[keys])
      setIndex(data.length + queue.length - 1)
      setData([...data, ...queue])
      setNames([...names, ...nn])
      setResultKeys([...result_keys, ...lkn])
      notification.success({ message: `${e.file.name} envoyé.` })
    } else if (e.file?.status === 'error' || (e.file?.status === 'done' && e.file.response[keys] === undefined)) {
      n = n.filter(x => x !== e.file.name)
      notification.error({ message: `${e.file.name} non envoyé.` })
    }
  }

  const reset_docs = () => {
    setIndex(0)
    setData([])
    setNames([])
    setResultKeys([])
  }

  const downloadResults = format => {
    if (result_keys.length) {
      let res = getLastResults(result_keys, format, [auth[0][0], auth[1][0]])
      .catch(e => {
        if (e.response.status == 404 ) {
          notification.error({
            message: 'Erreur Téléchargement',
            description: 'Pas de données disponible : les données sont expirées ou déjà téléchargées'
          })
        } else {
          notification.error({
            message: 'Erreur ' + e.response.status,
            description: e.response.statusText
          })
        }
      })
      .then((response) => {
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          let output_file = "resultats.csv"
          if ( format === "excel") output_file = "resultats.xlsx"
          link.setAttribute('download', output_file) //or any other extension
          document.body.appendChild(link)
          link.click()
        }
      })
    } else {
      notification.error({
        message: 'Erreur Téléchargement',
        description: 'Pas de données disponibles.'
      })
    }
  }

  return (
    <Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={x => setCollapsed(x)}>
        {
          collapsed ?
          <div className="logo">
            {'S-IA'}
          </div>
          :
          <div className="logo">
            {'Signalement AI'}
          </div>
        }
        <Menu
          theme="dark"
          mode="inline"
          onClick={e => setMenu(e.key)}
          selectedKeys={[menu]}
        >
          <Menu.Item key="0" selected={rootRoutes.indexOf(location.pathname).toString() === "0"}>
            <Link to="/classification">
              <img src={classificationIcon} width="20em" height="20em" />&nbsp;&nbsp;
              <span className="menu-item-link">
                {'Classification'}
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="1" selected={rootRoutes.indexOf(location.pathname).toString() === "1"}>
            <Link to="/visualisation">
              <img src={explorationIcon} width="20em" height="20em" />&nbsp;&nbsp;
              <span className="menu-item-link">
                {'Visualisation'}
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2" selected={rootRoutes.indexOf(location.pathname).toString() === "2"}>
            <Link to="/about">
              <QuestionCircleOutlined />
              <span className="menu-item-link">
                {'À propos'}
              </span>
            </Link>
          </Menu.Item>
        </Menu>
        <Row span={1}>
          <br/>
          <br/>
          <br/>
        </Row>
        <Row justify="center">
          <Upload
            headers={headers(auth[0][0], auth[1][0])}
            showUploadList={false}
            multiple={true}
            onChange={handleChange}
            action={route}
            style={{ display: 'block', width: '100%'}}
          >
            <Button
              style={{ display: 'block', width: '200px', height: "200px" }}
              type="primary"
            >
              Upload
            </Button>
          </Upload>
        </Row>
        <Row span={1}>
          <br/>
          <br/>
          <br/>
        </Row>
        <Row>
          <Button
            style={{ display: 'block', width: '100%' }}
            type="primary"
            onClick={() => downloadResults('csv')}
          >
            Obtenir CSV
          </Button>
          <Button
            style={{ display: 'block', width: '100%' }}
            type="primary"
            onClick={() => downloadResults('excel')}
          >
            Obtenir Excel
          </Button>
         </Row>
        </Sider>
        <Layout>
        {children}
        <Footer>
          <a href="#">{'S-IA'}</a>
        </Footer>
      </Layout>
    </Layout>
  )
}

export { MainLayout }
