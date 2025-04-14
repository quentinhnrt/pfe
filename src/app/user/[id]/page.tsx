import Image from "next/image";

export default async function ProfilePage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    const userResponse = await fetch(process.env.BETTER_AUTH_URL+"/api/user/"+id)
    const user = await userResponse.json()

    return (
        <div>
            <h1>{user.firstname}</h1>
            <div className={"space-y-8"}>
                {user.posts?.length && user.posts.map(post => (
                    <div key={"post-" + post.id} className={"bg-red-200"}>
                        <p>{post.content}</p>
                        <div className={"grid grid-cols-3"} >
                            {post.artworks?.length && post.artworks.map(artwork => (

                                <Image src={artwork.thumbnail} alt={artwork.title} width={100} height={100} key={"artwork-" + artwork.id}/>

                                ))}
                        </div>
                        </div>
                        ))}
                    </div>
                    </div>
                    )
                }