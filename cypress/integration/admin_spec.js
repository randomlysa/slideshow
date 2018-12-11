import axios from 'axios';

// URL to reset DB.
// http://localhost/slideshow/public/php/sqliteConfig.php?env=test&create=true

// URL to get info about a bulletin
const getBulletinConfig = bulletin => {
  return axios.get(
    `http://localhost/slideshow/public/php/sqliteGetBulletinConfigByName.php?name=${bulletin}&env=test`
  );
};

// I know I'm not supposed to do a login this way but my current login setup
// doesn't work any other way.
describe('The admin section', function() {
  it('should let me log in', function() {
    cy.visit('http://localhost:3000/login/test')
      .get('[data-cy=usernameLogin]')
      .type('test')
      .get('[data-cy=passwordLogin]')
      .type('test')
      .get('[data-cy=loginForm]')
      .submit();
  });

  // Todo - create folders test1, test2, and add 3 files to each.
  it('should switch to folder test1', function() {
    cy.get('[data-cy=selectActiveFolder]').select('test1');
  });

  it('should load slide and transition duration from the database', async function() {
    // Database is setup with slideDuration of 5000 and transition duration of
    // 300 for folder test1.
    await getBulletinConfig('test1').then(r => {
      console.log(r);
      expect(r.data.slideDuration).to.equal('5000');
      expect(r.data.transitionDuration).to.equal('300');
    });
  });

  it('should set the weather to Boston', async function() {
    // Not sure how to set data or id on AsyncTypeahead
    cy.get('.rbt-input-main')
      .focus()
      .type('Boston{downarrow}{enter}{enter}', { delay: 200 });
    // cy.reload()
    await getBulletinConfig('test1').then(r => {
      expect(r.data.cityToShowWeatherFor).to.include('Boston');
    });
  });
});