import axios from 'axios';

// URL to reset DB.
// http://localhost/slideshow/public/php/sqliteConfig.php?env=test&create=true

// Reset the database.
axios.get(
  'http://localhost/slideshow/public/php/sqliteConfig.php?env=test&create=true'
);

// Function to get info about 'bulletin; provide name: folderName
const getBulletinConfig =
  'http://localhost/slideshow/public/php/sqliteGetBulletinConfigByName.php?env=test';

// I know I'm not supposed to do a login this way but my current login setup
// doesn't work any other way.
describe('The admin section', function() {
  beforeEach(() => {
    // something here
  });

  it('should let me log in', function() {
    cy.visit('http://localhost:3000/login/test')
      .get('[data-cy=usernameLogin]')
      .type('test')
      .get('[data-cy=passwordLogin]')
      .type('test')
      .get('[data-cy=loginForm]')
      .submit();
    cy.location('pathname').should('eq', '/admin/test');
  });

  // Todo - create folders test1, test2, and add 3 files to each.
  it('should switch to folder test1', function() {
    cy.get('[data-cy=selectActiveFolder]').select('test1');
  });

  it('should load slide and transition duration from the database', function() {
    // Database is setup with slideDuration of 5000 and transition duration of
    // 300 for folder test1.
    // cy.visit('http://localhost:3000/admin/test');
    cy.request('GET', `${getBulletinConfig}&name=test1`).then(r => {
      const body = JSON.parse(r.body);
      expect(body.slideDuration).to.equal('5000');
      expect(body.transitionDuration).to.equal('300');
    });
  });

  it('should change update and transition duration in the form and database', function() {
    // Database is setup with slideDuration of 5000 and transition duration of
    // 300 for folder test1.
    const newSlideDuration = '5050';
    const newTranistionDuration = '600';

    cy.get('[data-cy=slideDuration')
      .clear()
      .type(newSlideDuration)
      .should('have.value', newSlideDuration);

    cy.get('[data-cy=transitionDuration')
      .clear()
      .type(newTranistionDuration)
      .should('have.value', newTranistionDuration);

    cy.get('form')
      .submit()
      .request('GET', `${getBulletinConfig}&name=test1`)
      .then(r => {
        const body = JSON.parse(r.body);
        expect(body.slideDuration).to.equal(newSlideDuration);
        expect(body.transitionDuration).to.equal(newTranistionDuration);
      });
  });

  it('should set the weather input to Boston using typeahead', function() {
    // Not sure how to set data or id on AsyncTypeahead
    cy.get('.rbt-input-main')
      .focus()
      .type('Boston{downarrow}{enter}', { delay: 200 })
      .get('form')
      .submit();

    cy.get('.rbt-input-main').should('have.value', 'Boston, GB');
  });

  it('should set the weather city in the db to Boston', function() {
    cy.request('GET', `${getBulletinConfig}&name=test1`).then(r => {
      const body = JSON.parse(r.body);
      expect(JSON.parse(body.cityToShowWeatherFor)).to.have.property(
        'NAME',
        'Boston'
      );
    });
  });
});
