// TODO - install jest and write test for helper functions

// Dependencies
import helpers from './helpers';

describe( 'helpers', () =>
{

  describe( 'formDataToJson', () =>
  {

    const form = document.createElement('form');

    const validJson = {
      category: '1',
      full_name: 'test_name',
      client_email: 'test_email',
      test: 'test_text',
      agree: 'true',
    };

    it( 'Should be defined', () =>
    {
      expect( helpers.formDataToJson(form) ).toBeDefined();
    } );
  } );

} );