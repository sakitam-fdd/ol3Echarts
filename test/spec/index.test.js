/* eslint-env es6 */
describe('indexSpec', () => {
  it('on and un', function () {
    let num = 0
    const event = new Observable();
    event.on('target', () => {
      num++
      expect(num).to.be.eql(1);
    })
    event.dispatch('target')
  });

  it('fire', function () {
    let num = 0
    const event = new Observable();
    event.on('target', () => {
      num++
      expect(num).to.be.eql(1);
    })
    event.dispatch('target')
  });

  it('once', function () {
    let counter = 0;
    const event = new Observable();
    function listener() {
      counter++;
      expect(this).to.be.eql(event);
    }
    function listener2() {
      counter++;
      expect(this).to.be.eql(event);
    }
    event.once('click', listener, event);
    event.on('click', listener2, event);
    event.dispatch('click').dispatch('click');
    expect(counter).to.be.eql(3);
  });

  it('once and un', function () {
    let counter = 0;
    const event = new Observable();
    function listener() {
      counter++;
      expect(this).to.be.eql(event);
    }
    event.once('click', listener, event);
    event.un('click', listener, event);
    event.dispatch('click').dispatch('click');
    expect(counter).to.be.eql(0);
  });

  it('clear', function () {
    let counter = 0;
    const event = new Observable();
    function listener() {
      counter++;
      expect(this).to.be.eql(event);
    }
    event.once('click', listener, event);
    event.on('click', listener, event);
    event.clear();
    event.dispatch('click').dispatch('click');
    expect(counter).to.be.eql(0);
  });

  it('throws an error when creating without new operator', () => {
    expect(() => { Observable.dispatch(); }).to.throwException();
  });
})
