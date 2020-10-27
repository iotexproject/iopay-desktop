import { CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useStore } from '../../../../stores';

export function BroadcastFailureComponent({
  errorMessage,
  suggestedMessage,
  action,
}: {
  errorMessage: string;
  suggestedMessage: string;
  action?: Object;
}): JSX.Element {
  const { lang } = useStore();
  return (
    <div>
      <div style={{ marginTop: '30px' }} />
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        <CloseCircleOutlined style={{ color: '#e54837' }} />
        <span style={{ marginLeft: '10px' }}>{lang.t('broadcast.fail')}</span>
      </p>

      <p>{lang.t('broadcast.fail.network')}</p>
      <ul>
        {errorMessage && (
          <li>
            {lang.t('broadcast.error.message')} {lang.t(errorMessage)}
          </li>
        )}
        <li>
          {lang.t('broadcast.suggested.action')}{' '}
          <strong>{lang.t(suggestedMessage)}</strong>
        </li>
      </ul>
      <div style={{ marginTop: '40px' }} />
      {action}
    </div>
  );
}
