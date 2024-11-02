import { getApiDocs } from "../../../lib/Swagger";
import ReactSwagger from "../components/ReactSwagger";


export default async function ApiDoc() {
    const spec = await getApiDocs();
  return (
    <div className='pt-6 flex justify-center items-center'>
      <section className='container'>
        <ReactSwagger spec={spec}  />
      </section>
    </div>
  )
}
