import React from 'react';

import { useLocalStore, useObserver } from 'mobx-react';
import { IButton } from '../features/stitches/components';
import { cssUtils } from '../features/stitches/css';

export default function CounterPage() {
  const store = useLocalStore(() => ({
    count: 0,
    setCount(count) {
      this.count = count;
    },
  }));
  return useObserver(() => (
    <div className={cssUtils.page}>
      <div>
        <div>Template: {store.count}</div>
        <IButton onClick={() => store.setCount(store.count + 1)}>+</IButton>
        <IButton onClick={() => store.setCount(store.count - 1)}>-</IButton>
      </div>
    </div>
  ));
}
