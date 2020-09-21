import { Button } from 'antd';
import { useLocalStore, useObserver } from 'mobx-react';
import React from 'react';

export const CouterComponent = () => {
  const store = useLocalStore(() => ({
    count: 0,
    setCount(count) {
      this.count = count;
    },
  }));
  return useObserver(() => (
    <div>
      <div>
        Template:
        {store.count}
      </div>
      <Button onClick={() => store.setCount(store.count + 1)}>+</Button>
      <Button onClick={() => store.setCount(store.count - 1)}>-</Button>
    </div>
  ));
};
