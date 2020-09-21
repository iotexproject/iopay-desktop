import React, { ReactNode } from 'react';
import './App.scss';

type Props = {
  children: ReactNode;
};

export const App = (props: Props) => {
  const { children } = props;
  return <>{children}</>;
};
