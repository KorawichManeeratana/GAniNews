import getPostData from "@/app/api/testdata/route"

export default function testPage({params}){
    // const data = await getPostData(params.id)
    // console.log(data)

    return(
        <div>
            <h1>hello</h1>
            {
                params.id
            }
        </div>
    )
}