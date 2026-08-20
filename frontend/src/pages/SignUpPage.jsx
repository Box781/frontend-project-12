import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Header from '../Components/Header.jsx'
import { setData } from '../slices/authSlice'
import * as yup from 'yup'
import { signUp } from '../api/auth.js'

const SignUpPage = () => {
    const { t } = useTranslation()
    const [nameFailed, setNameFailed] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signupSchema = yup.object({
        username: yup
            .string()
            .min(3, t('signup.usernameLengthError'))
            .max(20, t('signup.usernameLengthError'))
            .required(t('signup.usernameLengthError')),
        password: yup
            .string()
            .min(6, t('signup.passwordError'))
            .required(t('signup.passwordError')),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], t('signup.confirmError'))
            .required(t('signup.confirmError')),
    })

    const handleSubmit = async (values) => {
        setNameFailed(false)
        try {
            const data = await signUp(values)
            dispatch(setData({ token: data.token, username: data.username }))
            navigate('/')
        } catch (error) {
            if (error.response?.status === 409) {
                setNameFailed(true)
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: signupSchema,
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
                                    {t('signup.title')}
                                </Card.Title>
                                <Form onSubmit={formik.handleSubmit}>
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Label>{t('signup.username')}</Form.Label>
                                        <Form.Control
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            autoFocus
                                            onChange={formik.handleChange}
                                            value={formik.values.username}
                                            isInvalid={(formik.touched.username && !!formik.errors.username) || nameFailed}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {nameFailed ? t('signup.usernameError') : formik.errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Label>{t('signup.password')}</Form.Label>
                                        <Form.Control
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                            isInvalid={formik.touched.password && !!formik.errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                        <Form.Label>{t('signup.confirmPassword')}</Form.Label>
                                        <Form.Control
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            onChange={formik.handleChange}
                                            value={formik.values.confirmPassword}
                                            isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.confirmPassword}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit" variant="primary" className="w-100">
                                        {t('signup.submit')}
                                    </Button>
                                </Form>
                            </Card.Body>
                            <Card.Footer className="text-center bg-white py-3">
                                {t('signup.haveAccount')}
                                {' '}
                                <Link to="/login">{t('signup.loginLink')}</Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SignUpPage
