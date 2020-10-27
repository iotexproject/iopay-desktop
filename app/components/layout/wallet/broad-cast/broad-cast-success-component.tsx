import { CheckCircleOutlined } from '@ant-design/icons';
import { colors } from '../../../../constants/colors';
import { useStore } from '../../../../stores';
import React from 'react';

export function BroadcastSuccessComponent({
  txHash,
  action,
}: {
  txHash: string;
  action?: Object;
}): JSX.Element {
  const { lang } = useStore();
  return (
    <div>
      <div style={{ marginTop: '30px' }} />
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        <CheckCircleOutlined style={{ color: colors.success }} />
        <span style={{ marginLeft: '10px' }}>{t('broadcast.success')}</span>
      </p>

      <p>{lang.t('broadcast.warn.one')}</p>
      <p>{lang.t('broadcast.warn.two')}</p>
      <p>
        {lang.t('broadcast.warn.three')}
        {/** <ActionPoll txHash={txHash} /> */}
        <span style={{ marginLeft: '5px' }}>
          {/** <CopyButtonClipboardComponent text={txHash} icon="copy" /> */}
        </span>
      </p>
      <div style={{ marginTop: '40px' }} />
      {action}
    </div>
  );
}
