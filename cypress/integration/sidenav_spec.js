const DEV_SERVER = 'http://localhost:3000';

beforeEach(function() {
  cy.visit(`${DEV_SERVER}/components/preview/sidenav`);
  /**
   * Use cypress aliases to share the context of the list and toggle
   * elements across different assertions.
   */
  cy.get('[data-rvt-sidenav-list="toggle-2"]').as('list');
  cy.get('[data-rvt-sidenav-toggle="toggle-2"]').as('toggle');
});

describe('Sidenav Interaction', function() {
  it('Should toggle visibility of a nested list', function() {
    cy.get('@list')
      .should('be.hidden');

    cy.get('@toggle')
      .should('have.attr', 'aria-expanded', 'false')
      .and('have.attr', 'aria-haspopup', 'true')
      .click()
      .should('have.attr', 'aria-expanded', 'true');

    cy.get('@list')
      .should('be.visible');

    cy.get('@toggle')
      .should('have.attr', 'aria-expanded', 'true')
      .click()
      .should('have.attr', 'aria-expanded', 'false');

    cy.get('@list')
      .should('be.not.visible');
  });

  it('Should fire a rvtSidenavListOpened custom event with correct element references', function() {
    cy.window().then(win => {
      var sidenav = win.document.querySelector('[data-rvt-sidenav]');
      var eventFired = false;
      var eventSidenavReference;
      var eventListReference;

      win.addEventListener('rvtSidenavListOpened', event => {
        eventFired = true;
        eventSidenavReference = event.target == sidenav;
        eventListReference = event.detail.list.dataset.rvtSidenavList == 'toggle-2';
      });

      sidenav.open('toggle-2');

      if (!eventFired) throw new Error('Did not fire sidenavListOpened event');
      if (!eventSidenavReference) throw new Error('Did not pass correct reference to emitting sidenav component element');
      if (!eventListReference) throw new Error('Did not pass correct reference to opened list element');
    });
  });

  it('Should fire a rvtSidenavListClosed custom event with correct element references', function() {
    cy.window().then(win => {
      var sidenav = win.document.querySelector('[data-rvt-sidenav]');
      var eventFired = false;
      var eventSidenavReference;
      var eventListReference;

      win.addEventListener('rvtSidenavListClosed', event => {
        eventFired = true;
        eventSidenavReference = event.target == sidenav;
        eventListReference = event.detail.list.dataset.rvtSidenavList == 'toggle-2';
      });

      sidenav.close('toggle-2');

      if (!eventFired) throw new Error('Did not fire sidenavListClosed event');
      if (!eventSidenavReference) throw new Error('Did not pass correct reference to emitting sidenav component element');
      if (!eventListReference) throw new Error('Did not pass correct reference to opened list element');
    });
  });
});