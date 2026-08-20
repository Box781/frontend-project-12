import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useZustandStore, { useUiStoreApi } from '../zustandStore'
import { Container, Row, Col, ListGroup, Form, Button, Dropdown, ButtonGroup } from 'react-bootstrap'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Header from '../Components/Header.jsx'
import ModalWindow from '../Components/ModalWindow.jsx'
import { notifications } from '@mantine/notifications'
import filter from 'leo-profanity'
import { useSocket } from '../contexts/SocketContext.jsx'
import {
  useChannels,
  useAddChannel,
  useRenameChannel,
  useRemoveChannel,
} from '../hooks/useChannels.js'
import { useMessages, useSendMessage } from '../hooks/useMessages.js'

const MainPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const socket = useSocket()
  const uiStore = useUiStoreApi()
  const token = useSelector((state) => state.auth.token)
  const username = useSelector((state) => state.auth.username)
  const { data: channels = [], isError: isChannelsError } = useChannels(token)
  const { data: messages = [], isError: isMessagesError } = useMessages(token)
  const { mutate: addChannel, isPending: isAddPending } = useAddChannel(token)
  const { mutate: renameChannel, isPending: isRenamePending } = useRenameChannel(token)
  const { mutate: removeChannel, isPending: isRemovePending } = useRemoveChannel(token)
  const { mutate: sendMessage, isPending } = useSendMessage(token)
  const currentChannelId = useZustandStore((s) => s.currentChannelId)
  const setCurrentChannelId = useZustandStore((s) => s.setCurrentChannelId)
  const modalType = useZustandStore((s) => s.modalType)
  const openModal = useZustandStore((s) => s.openModal)
  const closeModal = useZustandStore((s) => s.closeModal)
  const channelIdToManage = useZustandStore((s) => s.channelIdToManage)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [submitError, setSubmitError] = useState(null)

  const handleAddChannel = (data) => {
    addChannel(filter.clean(data.name.trim()), {
      onSuccess: (channel) => {
        notifications.show({ message: t('toast.channelCreated'), color: 'green' })
        closeModal()
        reset()
        setCurrentChannelId(channel.id)
      },
      onError: () => {
        notifications.show({ message: t('toast.networkError'), color: 'red' })
      },
    })
  }

  const handleRemoveChannelClick = () => {
    removeChannel(channelIdToManage, {
      onSuccess: () => {
        notifications.show({ message: t('toast.channelRemoved'), color: 'red' })
        closeModal()
      },
      onError: () => {
        notifications.show({ message: t('toast.networkError'), color: 'red' })
      },
    })
  }

  const handleRenameChannelSubmit = (data) => {
    renameChannel(
      { id: channelIdToManage, name: filter.clean(data.name.trim()) },
      {
        onSuccess: () => {
          notifications.show({ message: t('toast.channelRenamed'), color: 'green' })
          closeModal()
          reset()
        },
        onError: () => {
          notifications.show({ message: t('toast.networkError'), color: 'red' })
        },
      },
    )
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    const form = e.target
    const body = form.body.value.trim()
    if (!body) return
    setSubmitError(null)
    sendMessage(
      { body: filter.clean(body), channelId: currentChannelId, username },
      {
        onSuccess: () => form.reset(),
        onError: () => {
          setSubmitError(t('chat.networkError'))
          notifications.show({ message: t('toast.networkError'), color: 'red' })
        },
      },
    )
  }

  useEffect(() => {
    if (isChannelsError || isMessagesError) {
      notifications.show({
        message: t('toast.networkError'),
        color: 'red',
      })
    }
  }, [isChannelsError, isMessagesError, t])

  useEffect(() => {
    if (!socket) return undefined

    const handleNewMessage = (payload) => {
      queryClient.setQueryData(['messages'], (old = []) => [...old, payload])
    }
    const handleNewChannel = (payload) => {
      queryClient.setQueryData(['channels'], (old = []) => [...old, payload])
    }
    const handleRemoveChannel = (payload) => {
      const { id } = payload
      queryClient.setQueryData(['channels'], (old = []) =>
        old.filter((channel) => channel.id !== id),
      )
      queryClient.setQueryData(['messages'], (old = []) =>
        old.filter((message) => message.channelId !== id),
      )
      const { currentChannelId: activeId, setCurrentChannelId: setActive } = uiStore.getState()
      if (activeId === id) {
        const nextChannels = queryClient.getQueryData(['channels']) ?? []
        const general = nextChannels.find((c) => c.name === 'general')
        if (general) setActive(general.id)
      }
    }
    const handleRenameChannel = (payload) => {
      queryClient.setQueryData(['channels'], (old = []) =>
        old.map((channel) => (channel.id === payload.id ? payload : channel)),
      )
    }

    socket.on('newMessage', handleNewMessage)
    socket.on('newChannel', handleNewChannel)
    socket.on('removeChannel', handleRemoveChannel)
    socket.on('renameChannel', handleRenameChannel)

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('newChannel', handleNewChannel)
      socket.off('removeChannel', handleRemoveChannel)
      socket.off('renameChannel', handleRenameChannel)
    }
  }, [socket, queryClient, uiStore])

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

  const channelMessages = messages.filter((message) => message.channelId === currentChannelId)
  const currentChannel = channels.find((channel) => channel.id === currentChannelId)

  const channelNameRules = {
    required: t('modals.channelNameRequired'),
    minLength: { value: 3, message: t('modals.channelNameLength') },
    maxLength: { value: 20, message: t('modals.channelNameLength') },
  }

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
                <ListGroup.Item key={channel.id} className="p-0 border-0">
                  <Dropdown as={ButtonGroup} className="d-flex w-100">
                    <Button
                      type="button"
                      variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                      className="w-100 text-start text-truncate"
                      onClick={() => setCurrentChannelId(channel.id)}
                    >
                      # {channel.name}
                    </Button>
                    {channel.removable && (
                      <Dropdown.Toggle
                        split
                        variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                        id={`channel-menu-${channel.id}`}
                      >
                        <span className="visually-hidden">{t('chat.manageChannel')}</span>
                      </Dropdown.Toggle>
                    )}
                    {channel.removable && (
                      <Dropdown.Menu>
                        <Dropdown.Item role="menuitem" onClick={() => openModal('rename', channel.id)}>
                          {t('chat.rename')}
                        </Dropdown.Item>
                        <Dropdown.Item role="menuitem" onClick={() => openModal('remove', channel.id)}>
                          {t('chat.remove')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={9} className="d-flex flex-column h-100 p-0">
            <div className="border-bottom px-3 py-2 bg-white">
              <b>{currentChannel?.name}</b>
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
              <Form onSubmit={handleSendMessage}>
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

      <ModalWindow
        show={modalType === 'add'}
        title={t('modals.addChannel')}
        onHide={closeModal}
      >
        <Form onSubmit={handleSubmit(handleAddChannel)}>
          <Form.Group className="mb-3" controlId="addChannelName">
            <Form.Label>{t('modals.channelName')}</Form.Label>
            <Form.Control
              autoFocus
              {...register('name', {
                ...channelNameRules,
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
          </Form.Group>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button type="button" variant="secondary" onClick={closeModal}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={isAddPending}>
              {t('send')}
            </Button>
          </div>
        </Form>
      </ModalWindow>

      <ModalWindow
        show={modalType === 'remove'}
        title={t('modals.removeChannel')}
        onHide={closeModal}
      >
        <p className="mb-3">{t('modals.removeConfirm')}</p>
        <div className="d-flex justify-content-end gap-2">
          <Button type="button" variant="secondary" onClick={closeModal}>
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={isRemovePending}
            onClick={handleRemoveChannelClick}
          >
            {t('modals.removeButton')}
          </Button>
        </div>
      </ModalWindow>

      <ModalWindow
        show={modalType === 'rename'}
        title={t('modals.renameChannel')}
        onHide={() => { closeModal(); reset() }}
      >
        <Form onSubmit={handleSubmit(handleRenameChannelSubmit)}>
          <Form.Group className="mb-3" controlId="renameChannelName">
            <Form.Label>{t('modals.channelName')}</Form.Label>
            <Form.Control
              autoFocus
              {...register('name', {
                ...channelNameRules,
                validate: (value) => {
                  const name = value.trim().toLowerCase()
                  const taken = channels.some(
                    (ch) => ch.name.toLowerCase() === name && ch.id !== channelIdToManage,
                  )
                  return !taken || t('modals.channelNameUnique')
                },
              })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button type="button" variant="secondary" onClick={() => { closeModal(); reset() }}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={isRenamePending}>
              {t('send')}
            </Button>
          </div>
        </Form>
      </ModalWindow>
    </div>
  )
}

export default MainPage
