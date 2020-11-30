import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from "react-router-dom";
import { Input, Button, Row, Col, notification } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { GlobalContext } from '../../GlobalContext.js'
import { getDocuments } from '../../requests';

export default () => {
  const history = useHistory()
  const context = useContext(GlobalContext).auth
  const [user, setUser] = context[0]
  const [pwd, setPwd] = context[1]

  const test_auth = (username, password) => {
    if (username && password) {
      getDocuments('test_id', [username, password]).catch(e => {
        if (e.request.status == 401) {
          notification.error({
            message: 'Erreur identifiant',
            description: "L'utilisateur et/ou le mot de passe sont faux"
          })
        } else {
          history.push('/classification')
        }
      })
    }
  }

  return (
    <div>
      <br /><br /><br /><br /><br />
      <Row justify="center">
        <Col span={9}>
          <h2>Identifiant</h2>
          <Input onChange={e => setUser(e.target.value)} />
        </Col>
      </Row>
      <Row justify="center">
        <Col span={9}>
          <h2>Mot de passe</h2>
          <Input type="password" onChange={e => setPwd(e.target.value)} />
        </Col>
      </Row>
      <br />
      <Row justify="center">
        <Col span={1}>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => test_auth(user, pwd)}>
            Valider
          </Button>
        </Col>
      </Row>
    </div>
  )
}
