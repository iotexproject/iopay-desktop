import { observer } from "mobx-react-lite"
import { Input } from 'antd'
import { useStore } from "../../store/index"
import MainLayout from "../../components/Layout"
import { css } from "../../utils/stitches.config"


const LoginPage = observer(() => {
  const { lang, wallet } = useStore()

  return <MainLayout title={lang.t("wellcome.back")} showBgColor={false}>
    <div className="flex flex-col mx-auto" style={{ maxWidth: 355 }}>
      <img className={styles.loginBanner} src="images/wellcome_back.png" alt="" />
      <div className={styles.loginTitle}>{lang.t("wellcome.back")}</div>
      <div className="text-lg font-medium mb-4">{lang.t("wallet.input.password")}</div>
      <Input size="large" placeholder={lang.t("password.placholder")} className="mb-20 text-base" />
      <button className={styles.unlockBtn}>Unlock</button>
    </div>
  </MainLayout>
})

const styles = {
  loginBanner: css({
    width: 430,
    display: 'block',
    margin: '4rem auto 3rem',
  }),
  loginTitle: css({
    fontWeight: 'bold',
    fontSize: '2.25rem',
    color: '#3F3D56',
    marginBottom: '7rem',
    textAlign: 'center'
  }),
  unlockBtn: css({
    width: 240,
    height: 40,
    textAlign: 'center',
    lineHeight: '40px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#00B4A0',
    fontSize: '1rem',
    color: '#fff',
    borderRadius: 4,
    margin: 'auto'
  })
}

export default LoginPage
