const {
    convertToFaranheit,
    dateBuilder,
} = require('./main');

test('Convert 36°c to °F', ()=> {
    expect(convertToFaranheit(36)).toEqual(96.8);
});

test('Convert timestamp to display format', ()=> {
    expect(dateBuilder(new Date(0))).toEqual('Thursday 1 January 1970');
});

