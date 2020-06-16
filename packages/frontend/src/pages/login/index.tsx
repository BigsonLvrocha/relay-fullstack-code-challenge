import * as React from 'react';
import { Formik, Form } from 'formik';
import { object, string } from 'yup';
import { commitMutation, fetchQuery } from 'react-relay';
import { toast } from 'react-toastify';

import { setAuthToken } from '../../services/session';
import { useRelayEnv } from '../../store/relayEnv';
import { query } from '../../store/me/meQuery';
import { useMeStore } from '../../store/me';
import { meQuery } from '../../store/me/__generated__/meQuery.graphql';
import logo from '../../assets/fastfeet-logo.png';

import { mutation } from './LoginMutation';
import { LoginMutation } from './__generated__/LoginMutation.graphql';

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
  const env = useRelayEnv();
  const { actions } = useMeStore();
  return (
    <Background>
      <Container>
        <Formik
          initialValues={{
            password: '',
            email: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={({ password, email }) => {
            commitMutation<LoginMutation>(env, {
              mutation,
              variables: {
                input: {
                  password,
                  email,
                },
              },
              onCompleted({ login }) {
                if (!login) {
                  toast.error('Server error');
                  return;
                }
                if (login.error) {
                  login.error.forEach(error => toast.error(error));
                  return;
                }
                if (login.token) {
                  setAuthToken(login.token);
                  fetchQuery<meQuery>(env, query, {})
                    .then(({ me }) => {
                      if (me && me.email && me.name && me.id) {
                        actions.login({
                          id: me.id,
                          email: me.email,
                          name: me.name,
                          token: login.token!,
                        });
                      } else {
                        setAuthToken(null);
                        actions.logout();
                      }
                    })
                    .catch((error: any) => {
                      // eslint-disable-next-line no-console
                      console.error(error);
                      toast.error('Server error');
                      setAuthToken(null);
                      actions.logout();
                    });
                }
              },
              onError(error) {
                // eslint-disable-next-line no-console
                console.error(error);
                toast.error('Server error');
              },
            });
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
              <ErrorText name="password" />
              <Button type="submit">Entrar no sistema</Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Background>
  );
};
