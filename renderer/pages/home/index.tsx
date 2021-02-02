import { Button } from "antd"
import Layout from "../../components/Layout"
import Link from "next/link"

const IndexPage = () => {
  return (
    <Layout title="Notice!">
      <h1>Notice!</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor
        sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar
      </p>
      <Button>
        <Link href="/wallet/import">I got it!</Link>
      </Button>
    </Layout>
  )
}

export default IndexPage
