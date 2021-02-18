import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { css } from '../../utils/stitches.config'

type Props = {
  title?: string,
  width?: number,
  close?: Function,
  children: ReactNode
}

export const Dialog = observer(({ title, width = 600, children, close }: Props) => {
  const { lang } = useStore();
  return (
    <div className={styles.dialog}>
      <div className="dialog-modal-mask"></div>
      <div className="dialog-modal-wrap">
        <div className="dialog-modal" style={{ width: width }}>
          <div className={`dialog-modal-header flex items-center justify-between`}>
            <span>{title}</span>
            <img src="images/close.png" alt="" onClick={() => close()} />
          </div>
          {children}
          <div className="flex items-center justify-center mt-12">
            <button className="cancel mr-6" onClick={() => close()} >{lang.t("Cancel")}</button>
            <button className="confirm">{lang.t("Confirm")}</button>
          </div>
        </div>
      </div>
    </div>
  );
});

const styles = {
  dialog: css({
    ".dialog-modal-mask": {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 999,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,.45)'
    },
    ".dialog-modal-wrap": {
      position: 'fixed',
      top: 0,
      left: 0,
      outline: 0,
      zIndex: 1000,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    ".dialog-modal": {
      padding: '20px 24px',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      borderRadius: 8,
      ".dialog-modal-header": {
        marginBottom: 26,
        span: {
          fontSize: '1.25rem',
          color: '#363647',
          fontWeight: 'bold'
        },
        img: {
          width: 44,
          height: 44,
          cursor: 'pointer'
        }
      },
      button: {
        width: 90,
        height: 40,
        lineHeight: '40px',
        borderRadius: 4,
        outline: 'none',
        textAlign: 'center',
        fontSize: '1rem',
        cursor: 'pointer'
      },
      ".cancel": {
        border: '1px solid #B4B8CB'
      },
      ".confirm": {
        backgroundColor: '#00B4A0',
        color: '#ffff'
      }
    }
  })
}
