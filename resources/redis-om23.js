// This is just sample, chumma... jsut to show how Redis-OM works
// It contains 4 steps
    //                  define a schema
    //                  create JS object
    //                  save JS object in Redis database
    //                  query Redis database
/***********************************************************************/

// Define a Schema
const schema = new Schema('album23', {
    artist: { type: 'string' },
    title: { type: 'text' },
    year: { type: 'number' }
});
/***********************************************************************/

// Create a Javascript object
const album23 = {
    artist: "Mushroomhead",
    title: "The Righteous & The Butterfly",
    year: 2014
}
/***********************************************************************/

// save JS object in Redis
await repository.save(album23);

/***********************************************************************/

// Query on Redis database
const albums = await repository.search()
    .where('artist').equals('Mushroomhead')
    .and('title').matches('butterfly')
    .and('year').is.greaterThan(2000)
    .return.all()

/***********************************************************************/