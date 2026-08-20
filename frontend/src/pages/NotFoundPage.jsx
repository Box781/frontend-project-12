import { useTranslation } from 'react-i18next'
import Header from '../Components/Header.jsx'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <div className="p-4 text-center">
        {t('notFound')}
        <Link to='/'>{t('toMain')}</Link>
      </div>
    </>
  )
}

export default NotFoundPage
