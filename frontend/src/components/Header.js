import React from 'react';
import { Link, Route } from 'react-router-dom';
import logo from '../images/header__logo.svg';

function Header({ userData, handleLogOut, loggedIn }) {
  const [hamburgerOpened, setHamburgerOpened] = React.useState(false);
  function handleHambergerMenu() {

    setHamburgerOpened(!hamburgerOpened);
  }

  return (
    <>
      {hamburgerOpened && loggedIn &&
        (<div className='header__container header__container_hamburger'>
          <p className='header__email'>{userData.email}</p>
          <Link className='header__auth-link header__auth-link_type_gray' to='/signin' onClick={handleLogOut} >Выйти</Link>
        </div>)
      }

      <header className="header">
        <a className="header__logo" href="https://learn.javascript.ru/" target="_self">
          <img className="header__img" src={logo} alt="Логотип. Место." />
        </a>
        <Route path='/signup'>
          <p className='header__email'>{userData.email}</p>
          <Link className='header__auth-link' to='/signin'>Войти</Link>
        </Route>
        <Route path='/signin'>
          <p className='header__email'>{userData.email}</p>
          <Link className='header__auth-link' to='/signup'>Регистрация</Link>
        </Route>
        <Route exact path='/'>
          <input id="header__hamburger-menu" className="header__hamburger-menu" type="checkBox" />
          <label htmlFor='header__hamburger-menu' className="header__hamburger-icon" onClick={handleHambergerMenu} />

          <div className='header__container'>
            <p className='header__email'>{userData.email}</p>
            <Link className='header__auth-link header__auth-link_type_gray' to='/signin' onClick={handleLogOut} >Выйти</Link>
          </div>
        </Route>
      </header>
    </>
  );
}

export default Header;
