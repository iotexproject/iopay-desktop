import { observer } from "mobx-react-lite"
import { Input } from 'antd'
import { useStore } from "../../store/index"
import MainLayout from "../../components/Layout"
import { css } from "../../utils/stitches.config"


const SettingPage = observer(() => {
  const { lang } = useStore()

  return <MainLayout title={lang.t("setting")}>
    <div className={styles.setting}>
      <div className="title">{lang.t("netWork")}</div>
      <Input className="enterInput" placeholder={lang.t("netWork.placholder")} />
      <div className="title">{lang.t("prc.url")}</div>
      <Input className="enterInput" placeholder={lang.t("prc.placholder")} />
      <div className="flex items-center justify-between">
        <button className="mr-8">{lang.t("Cancel")}</button>
        <button className="save">{lang.t("save")}</button>
      </div>
    </div>
  </MainLayout>
})

const styles = {
  setting: css({
    width: 546,
    ".title": {
      fontSize: "1.25rem",
      marginBottom: "1.2rem",
      fontWeight: 'bold',
      color: '#3F3D56'
    },
    ".enterInput": {
      width: 546,
      marginBottom: '4.75rem'
    },
    button: {
      width: 240,
      height: 40,
      lineHeight: '40px',
      textAlign: 'center',
      fontSize: '1rem',
      outline: 'none',
      border: '1px solid #B4B8CB',
      borderRadius: 4
    },
    ".save": {
      backgroundColor: '#00B4A0',
      color: '#fff',
      borderColor: '#00B4A0'
    }
  })
}

export default SettingPage
