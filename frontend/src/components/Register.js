import React from 'react';
import { Link } from "react-router-dom";
function Register({ handleRegister }) {
  const [data, setData] = React.useState({
    email: '',
    password: ''
  });


  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value })
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { password, email } = data;
    handleRegister({ password, email });
  }

  return (
    <form className="form" name='register' noValidate onSubmit={handleSubmit}>
      <h2 className="form__title">Регистрация</h2>
      <label className="form__field">
        <input className="form__input" type="email" placeholder="Email" name="email" onChange={handleChange}
          value={data.email} required/>
      </label>
      <label className="form__field">
        <input className="form__input" type="password" placeholder="Пароль" name="password" onChange={handleChange}
          value={data.password} required/>
      </label>
      <button className="form__button" type="submit">Зарегистрироваться</button>
      <Link className='form__link' to='/signin' >Уже зарегистрированы? Войти</Link>
    </form>
  );
}

export default Register;  