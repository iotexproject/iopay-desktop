import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const App = (props: Props) => {
  const { children } = props;
  return <>{children}</>;
};
