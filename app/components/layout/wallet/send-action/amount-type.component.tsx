import { Select } from 'antd';
import React from 'react';
const { Option } = Select;
const tokenTypes = [
  {
    label: 'IOTX',
    key: 'iotx',
  },
  {
    label: 'VITA',
    key: 'vita',
  },
];
export const AmountTypeComponent = (props: { onChose: (token: 'iotx' | 'vita') => void }) => {
  return (
    <Select style={{ width: 100 }} defaultValue="iotx" onSelect={props.onChose}>
      {tokenTypes.map((type) => (
        <Option value={type.key} key={type.key}>
          {type.label}
        </Option>
      ))}
    </Select>
  );
};
