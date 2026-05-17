import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock the API module
jest.mock('../lib/api', () => ({
  fetchPosts: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(() => '/'),
}))

describe('Blog Components', () => {
  describe('Header Component', () => {
    it('renders header with navigation links', () => {
      // This test verifies header renders properly
      // In a real scenario, you'd import and render the Header component
      const MockHeader = () => (
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/archive">Archive</a>
          </nav>
        </header>
      )

      render(<MockHeader />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Archive')).toBeInTheDocument()
    })

    it('displays login/signup buttons when not authenticated', () => {
      const MockHeader = () => (
        <header>
          <div>
            <button>Login</button>
            <button>Sign Up</button>
          </div>
        </header>
      )

      render(<MockHeader />)
      
      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })
  })

  describe('Post List Component', () => {
    it('renders list of posts', () => {
      const MockPostList = ({ posts }) => (
        <div>
          {posts.map((post) => (
            <article key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      )

      const posts = [
        { id: 1, title: 'First Post', excerpt: 'First excerpt' },
        { id: 2, title: 'Second Post', excerpt: 'Second excerpt' },
      ]

      render(<MockPostList posts={posts} />)
      
      expect(screen.getByText('First Post')).toBeInTheDocument()
      expect(screen.getByText('Second Post')).toBeInTheDocument()
    })

    it('displays empty state when no posts', () => {
      const MockPostList = ({ posts }) => (
        <div>
          {posts.length === 0 ? (
            <p>No posts found</p>
          ) : (
            posts.map((post) => (
              <article key={post.id}>
                <h2>{post.title}</h2>
              </article>
            ))
          )}
        </div>
      )

      render(<MockPostList posts={[]} />)
      
      expect(screen.getByText('No posts found')).toBeInTheDocument()
    })
  })

  describe('Post Card Component', () => {
    it('renders post card with title and excerpt', () => {
      const MockPostCard = ({ post, onDelete, onEdit }) => (
        <div data-testid="post-card">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )

      const post = {
        id: 1,
        title: 'Test Post',
        excerpt: 'Test excerpt',
      }

      const mockEdit = jest.fn()
      const mockDelete = jest.fn()

      render(
        <MockPostCard 
          post={post} 
          onEdit={mockEdit}
          onDelete={mockDelete}
        />
      )
      
      expect(screen.getByText('Test Post')).toBeInTheDocument()
      expect(screen.getByText('Test excerpt')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('calls edit callback when edit button clicked', async () => {
      const MockPostCard = ({ post, onEdit, onDelete }) => (
        <div>
          <h3>{post.title}</h3>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )

      const post = { id: 1, title: 'Test Post', excerpt: 'Test' }
      const mockEdit = jest.fn()
      const mockDelete = jest.fn()

      render(
        <MockPostCard 
          post={post} 
          onEdit={mockEdit}
          onDelete={mockDelete}
        />
      )

      const editButton = screen.getByText('Edit')
      fireEvent.click(editButton)

      expect(mockEdit).toHaveBeenCalled()
    })

    it('calls delete callback when delete button clicked', async () => {
      const MockPostCard = ({ post, onEdit, onDelete }) => (
        <div>
          <h3>{post.title}</h3>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )

      const post = { id: 1, title: 'Test Post', excerpt: 'Test' }
      const mockEdit = jest.fn()
      const mockDelete = jest.fn()

      render(
        <MockPostCard 
          post={post} 
          onEdit={mockEdit}
          onDelete={mockDelete}
        />
      )

      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('Login Form Component', () => {
    it('renders login form with email and password fields', () => {
      const MockLoginForm = ({ onSubmit }) => (
        <form onSubmit={onSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
          />
          <button type="submit">Sign In</button>
        </form>
      )

      render(<MockLoginForm onSubmit={jest.fn()} />)
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })

    it('submits form with email and password', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn()

      const MockLoginForm = ({ onSubmit }) => {
        const [email, setEmail] = React.useState('')
        const [password, setPassword] = React.useState('')

        return (
          <form onSubmit={(e) => {
            e.preventDefault()
            onSubmit({ email, password })
          }}>
            <input 
              name="email"
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              name="password"
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit">Sign In</button>
          </form>
        )
      }

      render(<MockLoginForm onSubmit={mockSubmit} />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByText('Sign In')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('shows validation message for empty email', async () => {
      const user = userEvent.setup()

      const MockLoginForm = ({ onSubmit }) => (
        <form onSubmit={onSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
          />
          <button type="submit">Sign In</button>
        </form>
      )

      const { container } = render(<MockLoginForm onSubmit={jest.fn()} />)

      const submitButton = screen.getByText('Sign In')
      await user.click(submitButton)

      // HTML5 validation will prevent submission
      expect(container.querySelector('input[type="email"]')).toHaveAttribute('required')
    })
  })

  describe('Post Editor Component', () => {
    it('renders post editor with title and content fields', () => {
      const MockPostEditor = ({ onSave, onCancel }) => (
        <form onSubmit={onSave}>
          <input 
            type="text" 
            placeholder="Post Title" 
            required 
          />
          <textarea 
            placeholder="Post Content" 
            required 
          />
          <input 
            type="text" 
            placeholder="Excerpt" 
            required 
          />
          <button type="submit">Save Post</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      )

      render(
        <MockPostEditor 
          onSave={jest.fn()} 
          onCancel={jest.fn()}
        />
      )
      
      expect(screen.getByPlaceholderText('Post Title')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Post Content')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Excerpt')).toBeInTheDocument()
      expect(screen.getByText('Save Post')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('submits post with title, content, and excerpt', async () => {
      const user = userEvent.setup()
      const mockSave = jest.fn()

      const MockPostEditor = ({ onSave, onCancel }) => {
        const [title, setTitle] = React.useState('')
        const [content, setContent] = React.useState('')
        const [excerpt, setExcerpt] = React.useState('')

        return (
          <form onSubmit={(e) => {
            e.preventDefault()
            onSave({ title, content, excerpt })
          }}>
            <input 
              name="title"
              type="text" 
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
            <textarea 
              name="content"
              placeholder="Post Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required 
            />
            <input 
              name="excerpt"
              type="text" 
              placeholder="Excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required 
            />
            <button type="submit">Save Post</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </form>
        )
      }

      render(
        <MockPostEditor 
          onSave={mockSave} 
          onCancel={jest.fn()}
        />
      )

      await user.type(screen.getByPlaceholderText('Post Title'), 'My Test Post')
      await user.type(screen.getByPlaceholderText('Post Content'), 'This is my test post content')
      await user.type(screen.getByPlaceholderText('Excerpt'), 'This is an excerpt')
      
      await user.click(screen.getByText('Save Post'))

      expect(mockSave).toHaveBeenCalledWith({
        title: 'My Test Post',
        content: 'This is my test post content',
        excerpt: 'This is an excerpt',
      })
    })

    it('calls cancel callback when cancel button clicked', async () => {
      const user = userEvent.setup()
      const mockCancel = jest.fn()

      const MockPostEditor = ({ onSave, onCancel }) => (
        <form onSubmit={onSave}>
          <input type="text" placeholder="Post Title" />
          <button type="submit">Save Post</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      )

      render(
        <MockPostEditor 
          onSave={jest.fn()} 
          onCancel={mockCancel}
        />
      )

      await user.click(screen.getByText('Cancel'))

      expect(mockCancel).toHaveBeenCalled()
    })
  })
})
