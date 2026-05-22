import LoginPageClient from './LoginPageClient';

const storyConfig = {
  title: 'Pages/Login',
  component: LoginPageClient,
  parameters: {
    layout: 'fullscreen',
  },
};

export default storyConfig;

export const Default = {
  render: () => <LoginPageClient />,
};
