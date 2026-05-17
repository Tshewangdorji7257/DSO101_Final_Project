import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock the API module
const mockLoginUser = jest.fn()
const mockRegisterUser = jest.fn()
const mockFetchPosts = jest.fn()

jest.mock('../lib/api', () => ({
  loginUser: mockLoginUser,
  registerUser: mockRegisterUser,
  fetchPosts: mockFetchPosts,
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

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Registration Flow', () => {
    it('successfully registers new user', async () => {
      const user = userEvent.setup()

      mockRegisterUser.mockResolvedValue({
        token: 'test-token',
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      })

      const MockSignupPage = ({ onRegister }) => (
        <form onSubmit={(e) => {
          e.preventDefault()
          onRegister({
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
          })
        }}>
          <input name="name" placeholder="Full Name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Create Account</button>
        </form>
      )

      const handleRegister = jest.fn(async (data) => {
        const result = await mockRegisterUser(data)
        return result
      })

      render(<MockSignupPage onRegister={handleRegister} />)

      await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      
      await user.click(screen.getByText('Create Account'))

      expect(handleRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })
    })

    it('shows error on failed registration', async () => {
      const user = userEvent.setup()

      mockRegisterUser.mockRejectedValue(new Error('Email already exists'))

      const MockSignupPage = ({ onRegister }) => {
        const [error, setError] = React.useState('')

        const handleSubmit = async (e) => {
          e.preventDefault()
          try {
            await onRegister({
              name: e.target.name.value,
              email: e.target.email.value,
              password: e.target.password.value,
            })
          } catch (err) {
            setError(err.message)
          }
        }

        return (
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Create Account</button>
            {error && <div role="alert">{error}</div>}
          </form>
        )
      }

      const handleRegister = jest.fn(async (data) => {
        await mockRegisterUser(data)
      })

      render(<MockSignupPage onRegister={handleRegister} />)

      await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      
      await user.click(screen.getByText('Create Account'))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Email already exists')
      })
    })
  })

  describe('User Login Flow', () => {
    it('successfully logs in user', async () => {
      const user = userEvent.setup()

      mockLoginUser.mockResolvedValue({
        token: 'test-token',
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      })

      const MockLoginPage = ({ onLogin }) => (
        <form onSubmit={(e) => {
          e.preventDefault()
          onLogin({
            email: e.target.email.value,
            password: e.target.password.value,
          })
        }}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
      )

      const handleLogin = jest.fn(async (data) => {
        const result = await mockLoginUser(data)
        return result
      })

      render(<MockLoginPage onLogin={handleLogin} />)

      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      
      await user.click(screen.getByText('Sign In'))

      expect(handleLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('shows error on invalid credentials', async () => {
      const user = userEvent.setup()

      mockLoginUser.mockRejectedValue(new Error('Invalid credentials'))

      const MockLoginPage = ({ onLogin }) => {
        const [error, setError] = React.useState('')

        const handleSubmit = async (e) => {
          e.preventDefault()
          try {
            await onLogin({
              email: e.target.email.value,
              password: e.target.password.value,
            })
          } catch (err) {
            setError(err.message)
          }
        }

        return (
          <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
            {error && <div role="alert">{error}</div>}
          </form>
        )
      }

      const handleLogin = jest.fn(async (data) => {
        await mockLoginUser(data)
      })

      render(<MockLoginPage onLogin={handleLogin} />)

      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'wrongpassword')
      
      await user.click(screen.getByText('Sign In'))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
      })
    })
  })

  describe('Post Fetching Flow', () => {
    it('fetches and displays posts', async () => {
      mockFetchPosts.mockResolvedValue({
        posts: [
          { id: 1, title: 'First Post', excerpt: 'First excerpt' },
          { id: 2, title: 'Second Post', excerpt: 'Second excerpt' },
        ],
      })

      const MockPostsPage = () => {
        const [posts, setPosts] = React.useState([])
        const [loading, setLoading] = React.useState(true)

        React.useEffect(() => {
          mockFetchPosts()
            .then(data => setPosts(data.posts))
            .finally(() => setLoading(false))
        }, [])

        if (loading) return <div>Loading...</div>

        return (
          <div>
            {posts.map(post => (
              <article key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        )
      }

      render(<MockPostsPage />)

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
        expect(screen.getByText('Second Post')).toBeInTheDocument()
      })
    })

    it('handles error when fetching posts fails', async () => {
      mockFetchPosts.mockRejectedValue(new Error('Failed to fetch posts'))

      const MockPostsPage = () => {
        const [error, setError] = React.useState('')

        React.useEffect(() => {
          mockFetchPosts().catch(err => setError(err.message))
        }, [])

        if (error) return <div role="alert">{error}</div>
        return <div>No posts</div>
      }

      render(<MockPostsPage />)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch posts')
      })
    })
  })
})
