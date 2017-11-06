module.exports = {
  people: getPeople()
};

function getPeople() {
  return [
    { id: '1', firstName: 'John', lastName: 'Papa', age: 25,
    location: 'Alcoi',lat:'43.260224',lng:'-5.727997' },
    { id: '2', firstName: 'Ward', lastName: 'Bell', age: 31,
    location: 'Xativa',lat:'38.990408',lng:'-1.518675'},
    { id: '3', firstName: 'Colleen', lastName: 'Jones', age: 21,
    location: 'Enguera',lat:'38.982403',lng:'-0.66493' },
    { id: '4', firstName: 'Madelyn', lastName: 'Green', age: 18,
    location: 'Valencia',lat:'39.460622',lng:'-0.371046' },
    { id: '5', firstName: 'Ella', lastName: 'Jobs', age: 18,
    location: 'Madrid',lat:'40.426343',lng:'-3.676987' },
    { id: '6', firstName: 'Landon', lastName: 'Gates', age: 11,
    location: 'Granada',lat:'37.1899',lng:'-3.607206' },
    { id: '7', firstName: 'Haley', lastName: 'Guthrie', age: 35,
    location: 'Salamanca',lat:'41.013662',lng:'-5.727997' },
    { id: '8', firstName: 'Aaron', lastName: 'Jinglehiemer', age: 22,
    location: 'Bilbao',lat:'43.260224',lng:'-2.934508' },
    { id: '9', firstName: 'Aaron', lastName: 'Jinglehiemer', age: 22,
    location: 'Bilbao',lat:'43.260224',lng:'-3.934508'}
    ];
}
