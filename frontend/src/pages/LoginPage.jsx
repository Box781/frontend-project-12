import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { setData } from '../slices/authSlice'
import Header from '../Components/Header.jsx'
import { login } from '../api/auth.js'

const LoginPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [authFailed, setAuthFailed] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    setAuthFailed(false)
    try {
      const data = await login(values)
      dispatch(setData({ token: data.token, username: data.username }))
      navigate('/')
    } catch (error) {
      if (error.response?.status === 401) {
        setAuthFailed(true)
      }
    }
  }
  
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: handleSubmit
  })

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <Container className="flex-grow-1 d-flex align-items-center py-4">
        <Row className="justify-content-center w-100 mx-0">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <Card.Title as="h1" className="h4 mb-4 text-center">
                  {t('login.title')}
                </Card.Title>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>{t('login.username')}</Form.Label>
                    <Form.Control
                      name="username"
                      type="text"
                      autoComplete="username"
                      autoFocus
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={authFailed}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>{t('login.password')}</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={authFailed}
                    />
                    <Form.Control.Feedback type="invalid">
                      {t('login.authFailed')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">
                    {t('login.submit')}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center bg-white py-3">
                {t('login.noAccount')}
                {' '}
                <Link to="/signup">{t('login.signupLink')}</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LoginPage
