import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import useZustandStore from '../zustandStore'
import { Container, Row, Col, ListGroup, Form, Button, Navbar } from 'react-bootstrap'
import { io } from 'socket.io-client'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

const MainPage = () => {
    const queryClient = useQueryClient()
    const token = useSelector((state) => state.auth.token)
    const username = useSelector((state) => state.auth.username)

    const { data: channels = [] } = useQuery({
        queryKey: ['channels'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/channels', {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data
        }
    })

    const { data: messages = [] } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/messages', {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data
        }
    })

    const currentChannelId = useZustandStore((s) => s.currentChannelId)
    const setCurrentChannelId = useZustandStore((s) => s.setCurrentChannelId)

    useEffect(() => {
        const socket = io()
        socket.on('newMessage', (payload) => {
            queryClient.setQueryData(['messages'], (old = []) => [...old, payload])
        })
        return () => {
            socket.off('newMessage')
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (channels.length > 0 && currentChannelId === null) {
            setCurrentChannelId(channels[0].id)
        }
    }, [channels, currentChannelId, setCurrentChannelId])

const [submitError, setSubmitError] = useState(null)

    const { mutate, isPending } = useMutation({
        mutationFn: (body) => {
            return axios.post('/api/v1/messages', { body, channelId: currentChannelId, username }, { headers: { Authorization: `Bearer ${token}` } })
        },
        onError: () => setSubmitError('Не удалось отправить сообщение. Проверьте соединение.'),
    })

    const channelMessages = messages.filter((message) => message.channelId === currentChannelId)
    const currentChannel = channels.find((channel) => channel.id === currentChannelId)

    return (
        <div className="d-flex flex-column h-100">
            <Navbar bg="light" className="border-bottom px-3">
                <Navbar.Brand>Chat</Navbar.Brand>
            </Navbar>

            <Container fluid className="flex-grow-1 overflow-hidden">
                <Row className="h-100">
                    <Col md={3} className="border-end bg-light p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <b>Каналы</b>
                        </div>
                        <ListGroup variant="flush">
                            {channels.map((channel) => (
                                <ListGroup.Item
                                    key={channel.id}
                                    action
                                    active={channel.id === currentChannelId}
                                    onClick={() => setCurrentChannelId(channel.id)}
                                >
                                    # {channel.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={9} className="d-flex flex-column h-100 p-0">
                        <div className="border-bottom px-3 py-2 bg-white">
                            <b># {currentChannel?.name}</b>
                        </div>
                        <div className="flex-grow-1 overflow-auto px-3 py-2">
                            {channelMessages.map((message) => (
                                <div key={message.id} className="mb-1">
                                    <b>{message.username}</b>
                                    {': '}
                                    {message.body}
                                </div>
                            ))}
                        </div>
                        <div className="border-top p-3 mt-auto">
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    const form = e.target
                                    const body = form.body.value.trim()
                                    if (!body) return
                                    setSubmitError(null)
                                    mutate(body, {
                                        onSuccess: () => form.reset(),
                                    })
                                }}
                            >
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        name="body"
                                        type="text"
                                        placeholder="Введите сообщение..."
                                        aria-label="Новое сообщение"
                                        disabled={isPending}
                                    />
                                    <Button type="submit" variant="primary" disabled={isPending}>
                                        Отправить
                                    </Button>
                                </div>
                                {submitError && <div className="text-danger mt-2">{submitError}</div>}
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MainPage