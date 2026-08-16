import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { logOut } from '../slices/authSlice'

const Header = () => {
  const { t } = useTranslation()
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logOut())
    navigate('/login')
  }

  return (
    <Navbar bg="light" className="border-bottom px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          {t('hexletChat')}
        </Navbar.Brand>
        {token && (
          <Button type="button" variant="outline-primary" onClick={handleLogout}>
            {t('logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  )
}

export default Header
