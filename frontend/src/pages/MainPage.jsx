import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import useZustandStore from '../zustandStore'
import { Container, Row, Col, ListGroup, Form, Button, Navbar } from 'react-bootstrap'

const MainPage = () => {
    const token = useSelector((state) => state.auth.token)

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
        if (channels.length > 0 && currentChannelId === null) {
            setCurrentChannelId(channels[0].id)
        }
    }, [channels, currentChannelId, setCurrentChannelId])

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
                                }}
                            >
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        name="body"
                                        type="text"
                                        placeholder="Введите сообщение..."
                                        aria-label="Новое сообщение"
                                    />
                                    <Button type="submit" variant="primary">
                                        Отправить
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MainPage