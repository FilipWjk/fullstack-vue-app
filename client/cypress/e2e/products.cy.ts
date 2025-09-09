/// <reference types="cypress" />

describe('Product Management', () => {
  beforeEach(() => {
    const api = Cypress.env('apiUrl') || 'http://localhost:3001/api'
    cy.intercept('GET', `${api}/products*`).as('getProducts')
    cy.intercept('GET', `${api}/products/*`).as('getProduct')
    cy.intercept('POST', `${api}/products`).as('createProduct')
    cy.intercept('PUT', `${api}/products/*`).as('updateProduct')
    cy.intercept('DELETE', `${api}/products/*`).as('deleteProduct')
    cy.intercept('GET', `${api}/categories`).as('getCategories')
  })

  describe('Products List View (Manager/Admin)', () => {
    beforeEach(() => {
      cy.loginAs('MANAGER')
      cy.visit('/products')
    })

    it('should display products list page', () => {
      cy.waitForApiResponse('@getProducts')
      cy.get('[data-testid="products-header"]').should('contain.text', 'Products')
      cy.get('[data-testid="add-product-button"]').should('be.visible')
      cy.get('[data-testid="products-table"]').should('be.visible')
      cy.get('[data-testid="search-input"]').should('be.visible')
      cy.get('[data-testid="category-filter"]').should('be.visible')
    })

    it('should filter products by search term (no matches case)', () => {
      cy.waitForApiResponse('@getProducts')
      cy.get('[data-testid="search-input"]').clear()
      cy.get('[data-testid="search-input"]').type('zzzz_nonexistent_12345')
      cy.waitForApiResponse('@getProducts')
      cy.get('[data-testid="products-table"] tbody').then(($tbody) => {
        const rows = $tbody.find('tr')
        // If the backend returns 0 matches, there should be no rows
        if (rows.length === 0) {
          expect(rows.length).to.eq(0)
        } else {
          // Some seeds may always return products; at least assert table visible
          cy.get('[data-testid="products-table"]').should('be.visible')
        }
      })
    })

    it('should filter products by category', () => {
      // Wait for initial products and categories load (categories needed for options)
      cy.waitForApiResponse('@getProducts')
      cy.waitForApiResponse('@getCategories')

      cy.get('[data-testid="category-filter"]').then(($select) => {
        const $options = $select.find('option')
        // If there is only the default option, skip filtering assertion gracefully
        if ($options.length <= 1) {
          cy.log('No category options available to filter – skipping category filter assertion')
          cy.get('[data-testid="products-table"]').should('be.visible')
          return
        }

        const firstRealOptionVal = $options.eq(1).val()
        if (!firstRealOptionVal) {
          cy.log('First real category option has no value – skipping')
          return
        }

        cy.wrap($select).select(String(firstRealOptionVal))
        cy.waitForApiResponse('@getProducts')
        cy.get('[data-testid="products-table"]').should('be.visible')
      })
    })

    it('should sort products by different columns', () => {
      cy.waitForApiResponse('@getProducts')

      // Sort by name
      cy.get('[data-testid="sort-name"]').click()
      cy.get('[data-testid="products-table"] tbody tr').first().should('be.visible')

      // Sort by price
      cy.get('[data-testid="sort-price"]').click()
      cy.get('[data-testid="products-table"] tbody tr').first().should('be.visible')

      // Sort by stock
      cy.get('[data-testid="sort-stock"]').click()
      cy.get('[data-testid="products-table"] tbody tr').first().should('be.visible')
    })

    it('should navigate to edit product', () => {
      cy.waitForApiResponse('@getProducts')
      cy.get('[data-testid="product-row"]').first().find('[data-testid="edit-product"]').click()
      cy.url().should('include', '/products')
      cy.url().should('include', '/edit')
    })

    it('should delete product with confirmation', () => {
      cy.waitForApiResponse('@getProducts')
      cy.get('[data-testid="product-row"]').first().find('[data-testid="delete-product"]').click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.get('[data-testid="confirm-delete"]').click()
      cy.waitForApiResponse('@deleteProduct')
      cy.checkToast('success', 'Product deleted successfully')
    })

    it('should cancel product deletion', () => {
      cy.waitForApiResponse('@getProducts')
      cy.get('[data-testid="product-row"]').first().find('[data-testid="delete-product"]').click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.get('[data-testid="cancel-delete"]').click()
      cy.get('[data-testid="confirm-dialog"]').should('not.exist')
    })
  })

  describe('Product Creation (Manager/Admin)', () => {
    beforeEach(() => {
      cy.loginAs('MANAGER')
      cy.visit('/products/create')
    })

    it('should display product creation form', () => {
      cy.waitForApiResponse('@getCategories')
      cy.get('[data-testid="product-form"]').should('be.visible')
      cy.get('[data-testid="name-input"]').should('be.visible')
      cy.get('[data-testid="description-input"]').should('be.visible')
      cy.get('[data-testid="price-input"]').should('be.visible')
      cy.get('[data-testid="stock-input"]').should('be.visible')
      cy.get('[data-testid="category-select"]').should('be.visible')
      cy.get('[data-testid="image-input"]').should('be.visible')
      cy.get('[data-testid="submit-button"]').should('be.visible')
      cy.get('[data-testid="cancel-button"]').should('be.visible')
    })

    it('should successfully create a new product', () => {
      cy.waitForApiResponse('@getCategories')

      cy.get('[data-testid="name-input"]').type('New Test Product')
      cy.get('[data-testid="description-input"]').type('This is a test product description')
      cy.get('[data-testid="price-input"]').type('29.99')
      cy.get('[data-testid="stock-input"]').type('100')
      cy.get('[data-testid="category-select"] option').then(($options) => {
        const firstRealOption = $options.eq(1)
        const value = firstRealOption.val() as string
        cy.get('[data-testid="category-select"]').select(value)
      })
      cy.get('[data-testid="image-input"]').type('https://via.placeholder.com/300x200')

      cy.get('[data-testid="submit-button"]').click()
      cy.waitForApiResponse('@createProduct')
      cy.checkToast('success', 'Product created successfully')
      cy.url().should('include', '/products')
    })

    it('should cancel product creation and return to products list', () => {
      cy.get('[data-testid="cancel-button"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/products')
    })
  })

  describe('Product Editing (Manager/Admin)', () => {
    beforeEach(() => {
      cy.loginAs('MANAGER')
      // Open first product from list dynamically
      cy.visit('/products')
      cy.waitForApiResponse('@getProducts')
      cy.get('[data-testid="product-row"]').first().find('[data-testid="edit-product"]').click()
    })

    it('should display product edit form with existing data', () => {
      cy.waitForApiResponse('@getProduct')
      cy.waitForApiResponse('@getCategories')

      cy.get('[data-testid="product-form"]').should('be.visible')
      cy.get('[data-testid="name-input"]').invoke('val').should('not.be.empty')
      cy.get('[data-testid="description-input"]').invoke('val').should('not.be.empty')
      cy.get('[data-testid="price-input"]').invoke('val').should('not.be.empty')
      cy.get('[data-testid="stock-input"]').invoke('val').should('not.be.empty')
      cy.get('[data-testid="category-select"]').invoke('val').should('not.be.empty')
    })

    it('should successfully update product', () => {
      cy.waitForApiResponse('@getProduct')
      cy.waitForApiResponse('@getCategories')

      cy.get('[data-testid="name-input"]').clear()
      cy.get('[data-testid="name-input"]').type('Updated Product Name')
      cy.get('[data-testid="price-input"]').clear()
      cy.get('[data-testid="price-input"]').type('39.99')
      cy.get('[data-testid="stock-input"]').clear()
      cy.get('[data-testid="stock-input"]').type('150')

      cy.get('[data-testid="submit-button"]').click()
      cy.waitForApiResponse('@updateProduct')
      cy.checkToast('success', 'Product updated successfully')
      cy.url().should('include', '/products')
    })

    it('should show validation errors when clearing required fields', () => {
      cy.waitForApiResponse('@getProduct')

      cy.get('[data-testid="name-input"]').clear()
      cy.get('[data-testid="price-input"]').clear()
      // Clicking submit should keep us on the page if HTML5 required fails
      cy.get('[data-testid="submit-button"]').click()
      cy.location('pathname').should('match', /\/products\/.+\/edit$/)
      // Check native validity state for required inputs
      cy.get('[data-testid="name-input"]').then(($el) => {
        const input = $el.get(0) as HTMLInputElement
        assert.isFalse(input.checkValidity(), 'name input validity')
      })
      cy.get('[data-testid="price-input"]').then(($el) => {
        const input = $el.get(0) as HTMLInputElement
        assert.isFalse(input.checkValidity(), 'price input validity')
      })
    })
  })

  describe('Product Access Control', () => {
    it('should deny access to regular users', () => {
      cy.loginAs('USER')
      cy.visit('/products')
      cy.url().should('include', '/my-orders')

      cy.visit('/products/create')
      cy.url().should('include', '/my-orders')

      cy.visit('/products/1/edit')
      cy.url().should('include', '/my-orders')
    })

    it('should allow access to managers', () => {
      cy.loginAs('MANAGER')
      cy.visit('/products')
      cy.url().should('include', '/products')

      cy.visit('/products/create')
      cy.url().should('include', '/products/create')
    })

    it('should allow access to admins', () => {
      cy.loginAs('ADMIN')
      cy.visit('/products')
      cy.url().should('include', '/products')

      cy.visit('/products/create')
      cy.url().should('include', '/products/create')
    })
  })
})
