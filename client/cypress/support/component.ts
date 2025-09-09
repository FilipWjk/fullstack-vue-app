// cypress/support/component.ts
/* eslint-disable @typescript-eslint/no-namespace */
import './commands'
import { mount } from 'cypress/vue'

// Augment Cypress types using TS namespace (allowed via disable above)
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)

// Example command
// Cypress.Commands.add('dataCy', (value) => {
//   return cy.get(`[data-cy=${value}]`)
// })
