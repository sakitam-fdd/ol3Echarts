/* eslint-env es6 */
describe('helperSpec', () => {
  it('getTarget dom', () => {
    const container = document.createElement('div');
    container.id = 'my-test'
    document.body.appendChild(container);
    expect(ol3Echarts.getTarget('#my-test')[0]).to.be.eql(container);
    container.parentNode.removeChild(container);
    expect(ol3Echarts.getTarget('#my-test')[0]).to.be.eql(undefined);
  });

  it('map', () => {
    let cont = 0
    ol3Echarts.map([0, 1], function (index) {
      cont += index
    })
    expect(cont).to.be.eql(1);
  });

  it('bind', () => {
    this.num = 9;
    var module = {
      num: 81,
      getNum: function() { return this.num; }
    };
    expect(module.getNum()).to.be.eql(81);
    var getNum = module.getNum;
    expect(getNum()).to.be.eql(9);
    // 创建一个'this'绑定到module的函数
    var boundGetNum = ol3Echarts.bind(getNum, module)
    expect(boundGetNum()).to.be.eql(81);
  });

  it('merge object', () => {
    const a = {'a': 1, 'b': 2};
    const b = {'c': 3};
    const c = ol3Echarts.merge(a, b)
    expect(c.c).to.be.eql(3);
  });
})
