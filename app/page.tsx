import Link from 'next/link'

const GET_POSTS = `
  query GetPosts {
    posts(first: 6) {
      nodes {
        id
        title
        excerpt
        slug
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
  }
`

async function getPosts() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ query: GET_POSTS }),
      cache: 'no-store'
    })
    const text = await res.text()
    const json = JSON.parse(text)
    return json.data?.posts?.nodes || []
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main>
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <h1 className="text-xl font-bold">Logo</h1>
        <div className="flex gap-8">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Get Started</button>
      </nav>

      <section className="relative text-white py-24 px-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1547658719-da2b51169166?w=1920')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <p className="text-sm mb-2">Welcome to MyBlog</p>
        <h2 className="text-4xl font-bold max-w-lg mb-6">Your Go-To Source for Web Development & Technology</h2>
        <button className="bg-blue-600 text-white px-6 py-3 rounded">Read More</button>
      </section>

      <section className="px-10 py-16">
        <h2 className="text-3xl font-bold mb-10">Latest Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <div key={post.id} className="border rounded overflow-hidden shadow">
                {post.featuredImage && (
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <div className="text-gray-500 text-sm mb-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  <p className="text-xs text-gray-400 mb-3">{post.author.node.name} | {new Date(post.date).toLocaleDateString()}</p>
                  <Link href={`/posts/${post.slug}`} className="text-blue-600 text-sm font-semibold">Read More →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}