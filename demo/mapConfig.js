var cor = [
  {
    "level": 0,
    "resolution": 156543.03392800014,
    "scale": 5.91657527591555E8
  },
  {
    "level": 1,
    "resolution": 78271.51696399994,
    "scale": 2.95828763795777E8
  },
  {
    "level": 2,
    "resolution": 39135.75848200009,
    "scale": 1.47914381897889E8
  },
  {
    "level": 3,
    "resolution": 19567.87924099992,
    "scale": 7.3957190948944E7
  },
  {
    "level": 4,
    "resolution": 9783.93962049996,
    "scale": 3.6978595474472E7
  },
  {
    "level": 5,
    "resolution": 4891.96981024998,
    "scale": 1.8489297737236E7
  },
  {
    "level": 6,
    "resolution": 2445.98490512499,
    "scale": 9244648.868618
  },
  {
    "level": 7,
    "resolution": 1222.992452562495,
    "scale": 4622324.434309
  },
  {
    "level": 8,
    "resolution": 611.4962262813797,
    "scale": 2311162.217155
  },
  {
    "level": 9,
    "resolution": 305.74811314055756,
    "scale": 1155581.108577
  },
  {
    "level": 10,
    "resolution": 152.87405657041106,
    "scale": 577790.554289
  },
  {
    "level": 11,
    "resolution": 76.43702828507324,
    "scale": 288895.277144
  },
  {
    "level": 12,
    "resolution": 38.21851414253662,
    "scale": 144447.638572
  },
  {
    "level": 13,
    "resolution": 19.10925707126831,
    "scale": 72223.819286
  },
  {
    "level": 14,
    "resolution": 9.554628535634155,
    "scale": 36111.909643
  },
  {
    "level": 15,
    "resolution": 4.77731426794937,
    "scale": 18055.954822
  },
  {
    "level": 16,
    "resolution": 2.388657133974685,
    "scale": 9027.977411
  }
];
var resolutions = [];
for (var i = 0; i < cor.length; i++) {
  resolutions.push(cor[i].resolution);
}
window.ol = HMap.ol