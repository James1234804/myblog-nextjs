import Link from 'next/link'
import Image from 'next/image'

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
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_POSTS }),
    next: { revalidate: 60 }
  })
  const json = await res.json()
  return json.data.posts.nodes
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <h1 className="text-xl font-bold">Logo</h1>
        <div className="flex gap-8">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Get Started</button>
      </nav>

      {/* Hero */}
      <section className="relative text-white py-24 px-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1547658719-da2b51169166?w=1920')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <p className="text-sm mb-2">Welcome to MyBlog</p>
        <h2 className="text-4xl font-bold max-w-lg mb-6">Your Go-To Source for Web Development & Technology</h2>
        <button className="bg-blue-600 text-white px-6 py-3 rounded">Read More</button>
      </section>

      {/* Latest Posts */}
      <section className="px-10 py-16">
        <h2 className="text-3xl font-bold mb-10">Latest Posts</h2>
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
      </section>
    </main>
  )
}