/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

describe('API Integration Tests', () => {
  beforeEach(() => {
    cy.clearAppData()
  })

  describe('Authentication API', () => {
    it('should successfully authenticate with valid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'manager@ecommerce.com',
          password: 'manager123',
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.eq(true)
        expect(response.body.data).to.have.property('token')
        expect(response.body.data).to.have.property('user')
        expect(response.body.data.user).to.have.property('email', 'manager@ecommerce.com')
      })
    })

    it('should reject invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'invalid@test.com',
          password: 'wrongpassword',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('message')
      })
    })

    it('should refresh token successfully', () => {
      // First login to get a token
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'manager@ecommerce.com',
          password: 'manager123',
        },
      }).then((loginResponse) => {
        const token = loginResponse.body.data.token

        // Use token to refresh
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/auth/refresh`,
          body: { token },
        }).then((refreshResponse) => {
          expect(refreshResponse.status).to.eq(200)
          expect(refreshResponse.body.data).to.have.property('token')
        })
      })
    })
  })

  describe('Products API', () => {
    let authToken: string
    let categoryId: string

    beforeEach(() => {
      // Get auth token for authenticated requests
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'manager@ecommerce.com',
          password: 'manager123',
        },
      }).then((response) => {
        authToken = response.body.data.token
        // Fetch a valid categoryId to use for product operations
        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiUrl')}/categories`,
          headers: { Authorization: `Bearer ${authToken}` },
        }).then((catRes) => {
          expect(catRes.status).to.eq(200)
          const categories = catRes.body.data as Array<{ id: string }>
          categoryId = categories[0]?.id
          expect(Boolean(categoryId), 'categoryId should be available from seed').to.eq(true)
        })
      })
    })

    it('should fetch all products', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/products`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('products')
        expect(response.body.data).to.have.property('pagination')
        expect(response.body.data.products).to.be.an('array')
      })
    })

    it('should create a new product', () => {
      const newProduct = {
        name: 'API Test Product',
        description: 'Created via API test',
        price: 99.99,
        stock: 50,
        categoryId,
        imageUrl: 'https://via.placeholder.com/300x200',
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/products`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: newProduct,
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.data).to.have.property('id')
        expect(response.body.data.name).to.eq(newProduct.name)
        // Price should be numeric and equal; coerce to Number for safety
        expect(Number(response.body.data.price)).to.eq(newProduct.price)
      })
    })

    it('should update an existing product', () => {
      // First create a product
      const newProduct = {
        name: 'Product to Update',
        description: 'Original description',
        price: 29.99,
        stock: 100,
        categoryId,
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/products`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: newProduct,
      }).then((createResponse) => {
        const productId = createResponse.body.data.id
        const updatedProduct = {
          ...newProduct,
          name: 'Updated Product Name',
          price: 39.99,
        }

        cy.request({
          method: 'PUT',
          url: `${Cypress.env('apiUrl')}/products/${productId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: updatedProduct,
        }).then((updateResponse) => {
          expect(updateResponse.status).to.eq(200)
          expect(updateResponse.body.data.name).to.eq(updatedProduct.name)
          expect(Number(updateResponse.body.data.price)).to.eq(updatedProduct.price)
        })
      })
    })

    it('should delete a product', () => {
      // First create a product to delete
      const newProduct = {
        name: 'Product to Delete',
        description: 'Will be deleted',
        price: 19.99,
        stock: 10,
        categoryId,
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/products`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: newProduct,
      }).then((createResponse) => {
        const productId = createResponse.body.data.id

        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/products/${productId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200)
        })
      })
    })

    it('should filter products by category', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/products?category=${categoryId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.products).to.be.an('array')
        response.body.data.products.forEach((product: any) => {
          expect(product.categoryId).to.eq(categoryId)
        })
      })
    })

    it('should search products by name', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/products?search=test`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.products).to.be.an('array')
      })
    })
  })

  describe('Orders API', () => {
    let authToken: string
    let userToken: string

    beforeEach(() => {
      // Get manager token
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'manager@ecommerce.com',
          password: 'manager123',
        },
      }).then((response) => {
        authToken = response.body.data.token
      })

      // Get user token
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'user1@example.com',
          password: 'user1123',
        },
      }).then((response) => {
        userToken = response.body.data.token
      })
    })

    it('should fetch all orders (manager)', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/orders`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('orders')
        expect(response.body.data).to.have.property('pagination')
        expect(response.body.data.orders).to.be.an('array')
      })
    })

    it('should fetch user orders only', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/orders/my-orders`,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('orders')
        expect(response.body.data.orders).to.be.an('array')
      })
    })

    it('should update order status (manager)', () => {
      // Get first order then update
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/orders`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((listRes) => {
        const firstId = listRes.body.data.orders?.[0]?.id
        if (!firstId) return
        cy.request({
          method: 'PATCH',
          url: `${Cypress.env('apiUrl')}/orders/${firstId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            status: 'PROCESSING',
          },
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.status).to.eq('PROCESSING')
        })
      })
    })

    it('should get order statistics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/orders/stats/summary`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('totalOrders')
        expect(response.body.data).to.have.property('totalRevenue')
        expect(response.body.data).to.have.property('averageOrderValue')
      })
    })
  })

  describe('Categories API', () => {
    let adminToken: string

    beforeEach(() => {
      // Get admin token
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'admin@ecommerce.com',
          password: 'admin123',
        },
      }).then((response) => {
        adminToken = response.body.data.token
      })
    })

    it('should fetch all categories', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/categories`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
    })

    it('should create a new category', () => {
      const newCategory = {
        name: `API Test Category ${Date.now()}`,
        description: 'Created via API test',
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/categories`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: newCategory,
        failOnStatusCode: false,
      }).then((response) => {
        expect([201, 409]).to.include(response.status)
      })
    })

    it('should update a category', () => {
      // First create a category
      const newCategory = {
        name: 'Category to Update',
        description: 'Original description',
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/categories`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: newCategory,
      }).then((createResponse) => {
        const categoryId = createResponse.body.data.id
        const updatedCategory = {
          name: `Updated Category ${Date.now()}`,
          description: 'Updated description',
        }

        cy.request({
          method: 'PUT',
          url: `${Cypress.env('apiUrl')}/categories/${categoryId}`,
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: updatedCategory,
        }).then((updateResponse) => {
          expect([200, 409]).to.include(updateResponse.status)
        })
      })
    })
  })

  describe('Analytics API', () => {
    let authToken: string

    beforeEach(() => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'manager@ecommerce.com',
          password: 'manager123',
        },
      }).then((response) => {
        authToken = response.body.data.token
      })
    })

    it('should fetch dashboard analytics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/analytics/dashboard`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.eq(true)
        expect(response.body.data).to.have.property('revenue')
        expect(response.body.data).to.have.property('orders')
        expect(response.body.data).to.have.property('products')
      })
    })

    it('should fetch sales trends', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/analytics/sales`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('chartData')
      })
    })

    it('should fetch top products', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/analytics/products?limit=10`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('topProducts')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle unauthorized requests', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/products`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('message')
      })
    })

    it('should handle invalid resource IDs', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'manager@ecommerce.com',
          password: 'manager123',
        },
      }).then((loginResponse) => {
        const token = loginResponse.body.data.token

        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiUrl')}/products/550e8400-e29b-41d4-a716-446655449999`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404)
          expect(response.body).to.have.property('message')
        })
      })
    })

    it('should validate request data', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'manager@ecommerce.com',
          password: 'manager123',
        },
      }).then((loginResponse) => {
        const token = loginResponse.body.data.token

        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/products`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            // Missing required fields
            description: 'Invalid product',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body).to.have.property('errors')
        })
      })
    })
  })
})
