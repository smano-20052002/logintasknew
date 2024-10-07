import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/LoginForm.css';
import { InputGroup, Form, Card, Button, Alert } from 'react-bootstrap';
import LoginImg from '../assets/images/image_prev_ui (1).png'
// import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = () => {
  const [formValues, setFormValues] = useState({
    userid: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const mobileRegex = /^[0-9]{10}$/;
  const [response, setResponse] = useState();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handlePaste = (e) => {
    e.preventDefault();
    setFormErrors({ ...formErrors, password: 'Pasting password is allowed' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      try {
        if (emailRegex.test(formValues.userid)) {
          setResponse(await axios.get('http://localhost:5000/users', {
            params: {
              useremail: formValues.userid,
              password: formValues.password
            }
          }));
        } else if (mobileRegex.test(formValues.userid)) {
          setResponse(await axios.get('http://localhost:5000/users', {
            params: {
              mobilenumber: formValues.userid,
              password: formValues.password
            }

          }
          ))
        }


        const user = response.data.find(
          user => (user.useremail === formValues.userid || user.mobilenumber === formValues.userid) && user.password === formValues.password
        );

        if (user) {
          setLoginMessage("Login successful");

        } else {
          setLoginMessage("Invalid credentials");
        }
      } catch (error) {
        console.error('Error during login', error);
        setLoginMessage("An error occurred during login");
      }
      finally{
        setTimeout(() => {
          setLoginMessage(undefined)
        }, 5000);
      }
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  const validate = (values) => {
    const errors = {};


    if (!values.userid) {
      errors.userid = "Email or mobile number is required!";
    } else if (!emailRegex.test(values.userid) && !mobileRegex.test(values.userid)) {
      errors.userid = "This is not a valid email or mobile number format!";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed 10 characters";
    }

    return errors;
  };

  return (
    <div className="login-background">
      { loginMessage &&
        <div className='alertmsg'>
          <Alert variant="warning">
            <span className='p-0'>{loginMessage}</span>
          </Alert>
        </div>

      }
      <Card className="login-card">
        <Card.Body>
          <form className='LoginForm' onSubmit={handleSubmit}>
            <div className='d-flex flex-row align-items-center'>
              <img className='login-img' src={LoginImg} />
              <h3 className='header'>Login</h3>
            </div>

            <hr className='divider' />
            <div className='input-container'>
              <Form.Label htmlFor="userid">Email / Mobile Number</Form.Label>
              <InputGroup className="mb-3">
                {/* <InputGroup.Text><FaUser /></InputGroup.Text> */}
                <Form.Control
                  placeholder="Email / Mobile Number"
                  aria-label="UserId"
                  className='input-field' name='userid' id="userid" value={formValues.userid} onChange={handleChange}
                />
              </InputGroup>
              <p className='input-error'>{formErrors.userid}</p>
            </div>
            <div className='input-container'>
              <Form.Label htmlFor="password">Enter password</Form.Label>
              <InputGroup className="mb-3">
                {/* <InputGroup.Text><FaLock /></InputGroup.Text> */}
                <Form.Control
                  type='password'
                  className='input-field' name='password' id="password" placeholder='Enter password' onPaste={(e) => { handlePaste(e) }} onCopy={(e) => { e.preventDefault() }} value={formValues.password} onChange={handleChange}
                />
              </InputGroup>
              <p className='input-error'>{formErrors.password}</p>
            </div>
            <div className='Submit-Container'>
              <Button className='Submit-Button' type="submit">Login</Button>
            </div>
            {/* {loginMessage && <p className='login-message'>{loginMessage}</p>} */}
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginForm;
