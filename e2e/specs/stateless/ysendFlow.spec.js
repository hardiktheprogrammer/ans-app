import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Send Flow', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('Should allow owner to change manager', () => {
    cy.visit('/profile/test123.arb')
    // connectFromExisting()
    cy.findByText('View Details').click()
    cy.findByText('Send').click()
    cy.findByTestId('send-name-input').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    cy.findByTestId('owner-checkbox').click()
    cy.findByText('Next').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Controller').should('have.text', '0xf39...92266')
  })
  it('Should allow manager to change manager when they are not the owner', () => {
    acceptMetamaskAccess(1)
    cy.visit('/profile/test123.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    //Should not allow the manager to change the owner
    cy.findByTestId('Make Owner', { timeout: 2000 }).should('not.exist')
    cy.findByTestId('send-name-input').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click({ force: true })
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Controller').should('have.text', '0x709...c79C8')
  })
  it('Should allow owner to change owner', () => {
    acceptMetamaskAccess(2)
    cy.visit('/profile/test123.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    cy.findByTestId('manager-checkbox').click()
    cy.findByTestId('send-name-input').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Registrant').should('have.text', '0xf39...92266')
  })

  it('Should allow owner to change manager if they are not the manager', () => {
    acceptMetamaskAccess(1)
    cy.visit('/profile/test123.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    cy.findByTestId('owner-checkbox').click()
    cy.findByTestId('send-name-input').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Controller').should('have.text', '0xf39...92266')
  })

  it('Should allow owner to change owner and manager', () => {
    acceptMetamaskAccess(1)
    cy.visit('/profile/test123.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    cy.findByTestId('send-name-input').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Registrant').should('have.text', '0x709...c79C8')
    cy.findByTestId('owner-button-name-Controller').should('have.text', '0x709...c79C8')
  })
  it('Should allow namewrapper owner to send name', () => {
    acceptMetamaskAccess(2)
    cy.visit('/profile/wrapped.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    cy.findByTestId('send-name-input').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Owner').should('have.text', '0xf39...92266')
  })
  it('Should allow namewrapper subname owner to send name', () => {
    acceptMetamaskAccess(1)
    cy.visit('/profile/sub.wrapped.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    cy.findByTestId('send-name-input').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Owner').should('have.text', '0x709...c79C8')
  })
  it('Should allow unwrapped subname to be sent by owner (setOwner)', () => {
    acceptMetamaskAccess(2)
    cy.visit('/profile/sub.test123.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    cy.findByTestId('send-name-input').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Controller').should('have.text', '0xf39...92266')
  })
  it('Should allow unwrapped subname to be sent by parent owner (setSubnodeOwner)', () => {
    acceptMetamaskAccess(2)
    cy.visit('/profile/sub.test123.arb')
    cy.findByText('View Details').click({ force: true })
    cy.findByText('Send').click()
    cy.findByTestId('send-name-input').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    cy.findByText('Next').click()
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('owner-button-name-Controller').should('have.text', '0x709...c79C8')
  })
})
