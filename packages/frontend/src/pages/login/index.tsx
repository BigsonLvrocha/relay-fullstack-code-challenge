import * as React from 'react';
import { Formik, Form } from 'formik';
import { object, string } from 'yup';

import logo from '../../assets/fastfeet-logo.png';

import {
  Background,
  Button,
  Title,
  Container,
  Input,
  Logo,
  ErrorText,
} from './styles';

const SignupSchema = object({
  email: string()
    .email()
    .required(),
  password: string()
    .required()
    .min(6),
});

export const Login: React.FunctionComponent = () => {
  return (
    <Background>
      <Container>
        <Formik
          initialValues={{
            password: '',
            email: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={values => {
            // same shape as initial values
            console.log(values);
          }}
        >
          {() => (
            <Form>
              <Logo src={logo} />
              <Title>SEU E-MAIL</Title>
              <Input name="email" type="text" placeholder="exemplo@email.com" />
              <ErrorText name="email" />
              <Title>SUA SENHA</Title>
              <Input
                name="password"
                type="password"
                placeholder="*************"
              />
              <ErrorText name="email" />
              <Button type="submit">Entrar no sistema</Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Background>
  );
};
