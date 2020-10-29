import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import React, { useState } from 'react';
import * as copy from 'text-to-clipboard';
import {
  ClipboardProps,
  ClipboardState,
} from '../../../../../interfaces/clipboard.interface';
import { useStore } from '../../../../../stores';

export const CopyButtonClipboardComponent = (props: ClipboardProps) => {
  const {
    lang: { t },
  } = useStore();
  const [state, setState] = useState<ClipboardState>({
    trigger: 'hover',
    title: t('copy.toClipboard'),
    copied: '',
    visible: false,
  });

  const copyToAddress = () => {
    copy.copyCB(props.text || '');
    setState({
      trigger: 'click',
      title: t('copy.copied'),
      copied: 'copied',
      visible: true,
    });
  };

  const handleVisibleChange = (visible: boolean) => {
    setState({ ...state, visible });
  };

  const hideTips = () => {
    setState({ ...state, copied: '', visible: false });
  };

  const btnReload = () => {
    setState({
      trigger: 'hover',
      title: t('copy.toClipboard'),
      copied: '',
      visible: true,
    });
  };

  return (
    <Tooltip
      placement="top"
      trigger={state.trigger}
      title={state.title}
      visible={state.visible}
      onVisibleChange={(v) => handleVisibleChange(v)}
    >
      <Button
        className={state.copied}
        icon={props.icon}
        shape="circle"
        onClick={() => copyToAddress()}
        onMouseLeave={() => hideTips()}
        onMouseOver={() => btnReload()}
      />
    </Tooltip>
  );
};
