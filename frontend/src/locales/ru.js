const ru = {
  translation: {
    hexletChat: 'Hexlet Chat',
    logout: 'Выйти',
    channels: 'Каналы',
    cancel: 'Отменить',
    send: 'Отправить',
    notFound: '404 — страница не найдена',

    login: {
      title: 'Войти',
      username: 'Имя пользователя',
      password: 'Пароль',
      submit: 'Войти',
      noAccount: 'Нет аккаунта?',
      signupLink: 'Регистрация',
      authFailed: 'Неверные имя пользователя или пароль',
    },

    signup: {
      title: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      submit: 'Зарегистрироваться',
      haveAccount: 'Уже есть аккаунт?',
      loginLink: 'Войти',
      usernameError: 'Имя: от 3 до 20 символов, или такое имя уже занято',
      passwordError: 'Пароль: обязательно, не менее 6 символов',
      confirmError: 'Пароли не совпадают',
    },

    chat: {
      messagePlaceholder: 'Введите сообщение...',
      messageAria: 'Новое сообщение',
      networkError: 'Не удалось отправить сообщение. Проверьте соединение.',
      rename: 'Переименовать',
      remove: 'Удалить',
    },

    modals: {
      addChannel: 'Добавить канал',
      renameChannel: 'Переименовать канал',
      removeChannel: 'Удалить канал',
      removeConfirm: 'Вы уверены?',
      removeButton: 'Удалить',
      channelNameRequired: 'Обязательное поле',
      channelNameMin: 'Минимум 3 символа',
      channelNameMax: 'Максимум 20 символов',
      channelNameUnique: 'Канал с таким именем уже существует',
    },
    toast: {
      networkError: 'Ошибка сети или загрузки данных',
      channelCreated: 'Канал создан',
      channelRenamed: 'Канал переименован',
      channelRemoved: 'Канал удалён',
    },
  },
}

export default ru
