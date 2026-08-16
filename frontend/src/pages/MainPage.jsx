import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import useZustandStore from '../zustandStore'
import { Container, Row, Col, ListGroup, Form, Button, Navbar, Modal, Dropdown, ButtonGroup } from 'react-bootstrap'
import { io } from 'socket.io-client'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Header from '../Components/Header.jsx'
import { notifications } from '@mantine/notifications'
import filter from 'leo-profanity'

const MainPage = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const token = useSelector((state) => state.auth.token)
    const username = useSelector((state) => state.auth.username)

    const { data: channels = [], isError: isChannelsError } = useQuery({
        queryKey: ['channels'],
        queryFn: async () => {
            const response = await axios.get('/api/v1/channels', {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data
        }
    })

    const { data: messages = [], isError: isMessagesError } = useQuery({
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
    const modalType = useZustandStore((s) => s.modalType)
    const openModal = useZustandStore((s) => s.openModal)
    const closeModal = useZustandStore((s) => s.closeModal)
    const channelIdToManage = useZustandStore((s) => s.channelIdToManage)

    const { register, handleSubmit, reset, formState: { errors }, setFocus } = useForm()

    const { mutate: addChannel, isPending: isAddPending } = useMutation({
        mutationFn: (name) =>{
            const cleanName = filter.clean(name.trim())
            return axios.post(
                '/api/v1/channels',
                { name: cleanName },
                { headers: { Authorization: `Bearer ${token}` } },
            )},
        onSuccess: (response) => {
            notifications.show({ message: t('toast.channelCreated'), color: 'green' })
            closeModal()
            reset()
            setCurrentChannelId(response.data.id) // перейти в новый канал
        },
        onError: () => {
            notifications.show({ message: t('toast.networkError'), color: 'red' })
        }
    })

    const { mutate: removeChannel, isPending: isRemovePending } = useMutation({
        mutationFn: () =>{
            return axios.delete(`/api/v1/channels/${channelIdToManage}`, {
                headers: { Authorization: `Bearer ${token}` },
            })},
        onSuccess: (response) => {
            notifications.show({ message: t('toast.channelRemoved'), color: 'red' })
            closeModal()
        },
        onError: () => {
            notifications.show({ message: t('toast.networkError'), color: 'green' })
        }
    })

    const { mutate: renameChannel, isPending: isRenamePending } = useMutation({
        mutationFn: (name) =>{
            const cleanName = filter.clean(name.trim())
            return axios.patch(`/api/v1/channels/${channelIdToManage}`, { name: cleanName }, {
                headers: { Authorization: `Bearer ${token}` },
            })},
        onSuccess: (response) => {
            notifications.show({ message: t('toast.channelRenamed'), color: 'green' })
            closeModal()
            reset()
        },
        onError: () => {
            notifications.show({ message: t('toast.networkError'), color: 'red' })
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (body) => {
            const cleanBody = filter.clean(body)
            return axios.post('/api/v1/messages', { body: cleanBody, channelId: currentChannelId, username }, { headers: { Authorization: `Bearer ${token}` } })
        },
        onError: () => {
            setSubmitError(t('chat.networkError'))
            notifications.show({ message: t('toast.networkError'), color: 'red' })
        }
    })

    useEffect(() => {
        if (isChannelsError || isMessagesError) {
            notifications.show({
                message: t('toast.networkError'),
                color: 'red',
            })
        }
    }, [isChannelsError, isMessagesError, t])

    useEffect(() => {
        const socket = io()
        socket.on('newMessage', (payload) => {
            queryClient.setQueryData(['messages'], (old = []) => [...old, payload])
        })
        socket.on('newChannel', (payload) => {
            queryClient.setQueryData(['channels'], (old = []) => [...old, payload])
        })
        socket.on('removeChannel', (payload) => {
            const { id } = payload
            queryClient.setQueryData(['channels'], (old = []) =>
                old.filter((channel) => channel.id !== id)
            )
            queryClient.setQueryData(['messages'], (old = []) =>
                old.filter((message) => message.channelId !== id)
            )
            const { currentChannelId, setCurrentChannelId } = useZustandStore.getState()
            if (currentChannelId === id) {
                const channels = queryClient.getQueryData(['channels']) ?? []
                const general = channels.find((c) => c.name === 'general')
                if (general) setCurrentChannelId(general.id)
            }
        })
        socket.on('renameChannel', (payload) => {
            queryClient.setQueryData(['channels'], (old = []) =>
                old.map((channel) =>
                    channel.id === payload.id ? payload : channel
                )
            )
        })
        return () => {
            socket.off('newMessage')
            socket.off('newChannel')
            socket.off('removeChannel')
            socket.off('renameChannel')
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (channels.length > 0 && currentChannelId === null) {
            setCurrentChannelId(channels[0].id)
        }
    }, [channels, currentChannelId, setCurrentChannelId])

    useEffect(() => {
        if (modalType === 'rename' && channelIdToManage) {
            const channel = channels.find((c) => c.id === channelIdToManage)
            reset({ name: channel?.name ?? '' })
        }
        if (modalType === 'add') {
            reset({ name: '' })
        }
    }, [modalType, channelIdToManage, channels, reset])

    const [submitError, setSubmitError] = useState(null)

    const channelMessages = messages.filter((message) => message.channelId === currentChannelId)
    const currentChannel = channels.find((channel) => channel.id === currentChannelId)

    return (
        <div className="d-flex flex-column h-100">
            <Header />

            <Container fluid className="flex-grow-1 overflow-hidden">
                <Row className="h-100">
                    <Col md={3} className="border-end bg-light p-3 overflow-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <b>{t('channels')}</b>
                            <Button
                                type="button"
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openModal('add')}
                            >
                                +
                            </Button>
                        </div>
                        <ListGroup variant="flush">
                            {channels.map((channel) => (
                                <ListGroup.Item
                                    key={channel.id}
                                    className="d-flex justify-content-between align-items-center"
                                    active={channel.id === currentChannelId}
                                >
                                    <button
                                        type="button"
                                        className={`btn btn-link text-decoration-none p-0 text-start text-truncate ${channel.id === currentChannelId ? 'link-light' : ''
                                            }`}
                                        onClick={() => setCurrentChannelId(channel.id)}
                                    >
                                        # {channel.name}
                                    </button>

                                    {channel.removable && (
                                        <Dropdown as={ButtonGroup} onClick={(e) => e.stopPropagation()}>
                                            <Dropdown.Toggle split variant="light" size="sm" id={`channel-menu-${channel.id}`} />
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    onClick={() => openModal('rename', channel.id)}
                                                >
                                                    {t('chat.rename')}
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() => openModal('remove', channel.id)}
                                                >
                                                    {t('chat.remove')}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
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
                                <div key={message.id} className="mb-1 text-break">
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
                                        placeholder={t('chat.messagePlaceholder')}
                                        aria-label={t('chat.messageAria')}
                                        disabled={isPending}
                                    />
                                    <Button type="submit" variant="primary" disabled={isPending}>
                                        {t('send')}
                                    </Button>
                                </div>
                                {submitError && <div className="text-danger mt-2">{submitError}</div>}
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Modal show={modalType === 'add'} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modals.addChannel')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={handleSubmit((data) => {
                            addChannel(data.name.trim())
                        })}
                    >
                        <Form.Control
                            autoFocus
                            {...register('name', {
                                required: t('modals.channelNameRequired'),
                                minLength: { value: 3, message: t('modals.channelNameMin') },
                                maxLength: { value: 20, message: t('modals.channelNameMax') },
                                validate: (value) =>
                                    !channels.some(
                                        (ch) => ch.name.toLowerCase() === value.trim().toLowerCase(),
                                    ) || t('modals.channelNameUnique'),
                            })}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button type="button" variant="secondary" onClick={closeModal}>
                                {t('cancel')}
                            </Button>
                            <Button type="submit" variant="primary" disabled={isAddPending}>
                                {t('send')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={modalType === 'remove'} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('modals.removeConfirm')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>{t('cancel')}</Button>
                    <Button
                        variant="danger"
                        disabled={isRemovePending}
                        onClick={() => removeChannel()}
                    >
                        {t('modals.removeButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalType === 'rename'} onHide={() => { closeModal(); reset() }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={handleSubmit((data) => {
                            renameChannel(data.name.trim())
                        })}
                    >
                        <Form.Control
                            autoFocus
                            {...register('name', {
                                required: t('modals.channelNameRequired'),
                                minLength: { value: 3, message: t('modals.channelNameMin') },
                                maxLength: { value: 20, message: t('modals.channelNameMax') },
                                validate: (value) => {
                                    const name = value.trim().toLowerCase()
                                    const taken = channels.some(
                                        (ch) =>
                                            ch.name.toLowerCase() === name
                                            && ch.id !== channelIdToManage
                                    )
                                    return !taken || t('modals.channelNameUnique')
                                },
                            })}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button type="button" variant="secondary" onClick={() => { closeModal(); reset() }}>
                                {t('cancel')}
                            </Button>
                            <Button type="submit" variant="primary" disabled={isRenamePending}>
                                {t('send')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default MainPage