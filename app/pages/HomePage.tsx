import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../constants/routes';
import { cssUtils } from '../features/stitches/css';

export default function HomePage() {
  return (
    <div className={cssUtils.page}>
      <div>
        <h2>Home</h2>
        <Link to={routes.COUNTER.path}>to Counter</Link>
      </div>
    </div>
  );
}
