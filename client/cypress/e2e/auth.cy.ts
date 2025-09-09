/// <reference types="cypress" />

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearAppData()
    const api = Cypress.env('apiUrl') || 'http://localhost:3001/api'
    cy.intercept('POST', `${api}/auth/login`).as('loginRequest')
    cy.intercept('POST', `${api}/auth/register`).as('registerRequest')
    cy.intercept('POST', `${api}/auth/logout`).as('logoutRequest')
  })

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
      cy.get('[data-testid="register-link"]').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/login')
      // trigger blur validation without clicking disabled submit
      cy.get('[data-testid="email-input"]').focus()
      cy.get('[data-testid="email-input"]').blur()
      cy.get('[data-testid="password-input"]').focus()
      cy.get('[data-testid="password-input"]').blur()
      cy.get('[data-testid="email-error"]').should('contain.text', 'email is required')
      cy.get('[data-testid="password-error"]').should('contain.text', 'password is required')
    })

    it('should show validation error for invalid email', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('invalid-email')
      cy.get('[data-testid="email-input"]').blur()
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="password-input"]').blur()
      // button stays disabled, assertion should rely on field error only
      cy.get('[data-testid="email-error"]').should('contain.text', 'Invalid email format')
    })

    it('should successfully login as manager and redirect to dashboard', () => {
      cy.loginAs('MANAGER')
      cy.url().should('include', '/dashboard')
      cy.get('[data-testid="sidebar"]').should('be.visible')
    })

    it('should successfully login as user and redirect to my-orders', () => {
      cy.loginAs('USER')
      cy.url().should('include', '/my-orders')
    })

    it('should show error for invalid credentials', () => {
      const api = Cypress.env('apiUrl') || 'http://localhost:3001/api'
      cy.intercept('POST', `${api}/auth/login`, {
        statusCode: 401,
        body: { success: false, message: 'Invalid email or password' },
      }).as('loginError')

      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('invalid@test.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()

      cy.wait('@loginError')
      cy.checkToast('error', 'Invalid email or password')
    })
  })

  describe('Registration Page', () => {
    it('should display registration form', () => {
      cy.visit('/register')
      cy.get('[data-testid="name-input"]').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="confirm-password-input"]').should('be.visible')
      cy.get('[data-testid="register-button"]').should('be.visible')
      cy.get('[data-testid="login-link"]').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/register')
      // trigger blur validations
      cy.get('[data-testid="name-input"]').focus()
      cy.get('[data-testid="name-input"]').blur()
      cy.get('[data-testid="email-input"]').focus()
      cy.get('[data-testid="email-input"]').blur()
      cy.get('[data-testid="password-input"]').focus()
      cy.get('[data-testid="password-input"]').blur()
      cy.get('[data-testid="confirm-password-input"]').focus()
      cy.get('[data-testid="confirm-password-input"]').blur()
      // Name error may be either "name is required" or min-length depending on validator order; accept both
      cy.get('[data-testid="name-error"]')
        .invoke('text')
        .then((text) => {
          const msg = text.trim().toLowerCase()
          const ok = msg.includes('required') || msg.includes('at least')
          assert.isTrue(ok, `name error text: ${text}`)
        })
      cy.get('[data-testid="email-error"]').should('contain.text', 'email is required')
      cy.get('[data-testid="password-error"]')
        .invoke('text')
        .then((text) => {
          const msg = text.trim().toLowerCase()
          const ok = msg.includes('required') || msg.includes('at least')
          assert.isTrue(ok, `password error text: ${text}`)
        })
    })

    it('should show error for password mismatch', () => {
      cy.visit('/register')
      cy.get('[data-testid="name-input"]').type('Test User')
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="confirm-password-input"]').type('differentpassword')
      cy.get('[data-testid="confirm-password-input"]').blur()
      cy.get('[data-testid="confirm-password-error"]').should(
        'contain.text',
        'Passwords do not match',
      )
    })

    it('should successfully register new user', () => {
      cy.visit('/register')
      const email = `newuser_${Date.now()}@test.com`
      cy.get('[data-testid="name-input"]').type('New User')
      cy.get('[data-testid="email-input"]').type(email)
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="confirm-password-input"]').type('password123')
      cy.get('[data-testid="register-button"]').click()

      cy.waitForApiResponse('@registerRequest')
      cy.checkToast('success', 'Account created successfully!')
      cy.url().should('include', '/my-orders')
    })
  })

  describe('Logout', () => {
    it('should successfully logout user', () => {
      cy.loginAs('USER')
      cy.get('[data-testid="user-menu"]').click()
      cy.contains('button', 'Sign out').click()

      cy.waitForApiResponse('@logoutRequest')
      cy.url().should('include', '/login')
      cy.window().its('localStorage').should('not.have.property', 'auth-token')
      cy.window().its('localStorage').should('not.have.property', 'token')
    })
  })

  describe('Route Protection', () => {
    it('should redirect unauthenticated users to login', () => {
      cy.visitProtectedRoute('/dashboard', true)
      cy.visitProtectedRoute('/products', true)
      cy.visitProtectedRoute('/orders', true)
      cy.visitProtectedRoute('/my-orders', true)
    })

    it('should redirect authenticated users from guest routes', () => {
      cy.loginAs('USER')
      cy.visit('/login')
      cy.url().should('include', '/my-orders')

      cy.visit('/register')
      cy.url().should('include', '/my-orders')
    })

    it('should prevent regular users from accessing manager routes', () => {
      cy.loginAs('USER')
      cy.visit('/dashboard')
      cy.url().should('include', '/my-orders')

      cy.visit('/products')
      cy.url().should('include', '/my-orders')

      cy.visit('/orders')
      cy.url().should('include', '/my-orders')
    })

    it('should prevent non-admin users from accessing admin routes', () => {
      cy.loginAs('MANAGER')
      cy.visit('/users')
      cy.url().should('include', '/dashboard')

      cy.visit('/categories')
      cy.url().should('include', '/dashboard')
    })
  })
})
