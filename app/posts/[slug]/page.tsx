async function getPost(slug: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!, {
    method: 'POST',
   headers: { 
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
},
    body: JSON.stringify({
      query: `
        query GetPost($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            title
            content
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
              }
            }
          }
        }
      `,
      variables: { slug }
    }),
    next: { revalidate: 60 }
  })
  const json = await res.json()
  return json.data.post
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {post.featuredImage && (
        <img
          src={post.featuredImage.node.sourceUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-400 text-sm mb-8">
        {post.author.node.name} | {new Date(post.date).toLocaleDateString()}
      </p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  )
}