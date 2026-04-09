import LoginPageClient from './LoginPageClient';

export default {
  title: 'Pages/Login',
  component: LoginPageClient,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => <LoginPageClient />,
};
