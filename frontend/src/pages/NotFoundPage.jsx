import { useTranslation } from 'react-i18next'
import Header from '../Components/Header.jsx'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <div className="p-4 text-center">{t('notFound')}</div>
    </>
  )
}

export default NotFoundPage
