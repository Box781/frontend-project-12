import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Button } from 'react-bootstrap'
import { logOut } from '../slices/authSlice'

const Header = ({ children }) => {
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
                    Hexlet Chat
                </Navbar.Brand>
                {token && (
                    <Button type="button" variant="outline-primary" onClick={handleLogout}>
                        Выйти
                    </Button>
                )}
            </Container>
        </Navbar>
    )
}

export default Header