import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import Header from '../Components/Header.jsx'
import { setData } from '../slices/authSlice'

const SignUpPage = () => {
  const [nameFailed, setNameFailed] = useState(false)
  const [passwordFailed, setPasswordFailed] = useState(false)
  const [confirmFailed, setConfirmFailed] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      setNameFailed(false)
      setPasswordFailed(false)
      setConfirmFailed(false)

      const { username, password, confirmPassword } = values
      let hasError = false
      if (!username || username.length < 3 || username.length > 20) {
        setNameFailed(true)
        hasError = true
      }
      if (!password || password.length < 6) {
        setPasswordFailed(true)
        hasError = true
      }
      if (!confirmPassword || password !== confirmPassword) {
        setConfirmFailed(true)
        hasError = true
      }

      if (hasError) return
      try {
        const { data } = await axios.post('/api/v1/signup', {
          username: values.username,
          password: values.password,
        })
        dispatch(setData({ token: data.token, username: data.username }))
        navigate('/')
      } catch (error) {
        if (error.response?.status === 409) {
          setNameFailed(true)
        }
      }
    },
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
                  Регистрация
                </Card.Title>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Имя пользователя</Form.Label>
                    <Form.Control
                      name="username"
                      type="text"
                      autoComplete="username"
                      autoFocus
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={nameFailed}
                    />
                    <Form.Control.Feedback type="invalid">
                      Имя: от 3 до 20 символов, или такое имя уже занято
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={passwordFailed}
                    />
                    <Form.Control.Feedback type="invalid">
                      Пароль: обязательно, не менее 6 символов
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Подтвердите пароль</Form.Label>
                    <Form.Control
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      isInvalid={confirmFailed}
                    />
                    <Form.Control.Feedback type="invalid">
                      Пароли не совпадают
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">
                    Зарегистрироваться
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center bg-white py-3">
                Уже есть аккаунт?
                {' '}
                <Link to="/login">Войти</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default SignUpPage
